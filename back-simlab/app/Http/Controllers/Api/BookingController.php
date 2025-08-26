<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\BookingRequest;
use App\Http\Requests\BookingEquipmentMaterialRequest;
use App\Http\Requests\BookingEquipmentRequest;
use App\Http\Requests\BookingVerifyRequest;
use App\Mail\BookingNotificationSupervisor;
use App\Models\Booking;
use App\Models\BookingApproval;
use App\Models\BookingEquipment;
use App\Models\BookingMaterial;
use App\Models\TahunAkademik;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BookingController extends BaseController
{
    private $activeAcademicYear;
    private array $restrictedRoles = ['mahasiswa', 'dosen', 'pihak_luar', 'Kepala Lab Terpadu'];

    public function __construct()
    {
        $this->activeAcademicYear = TahunAkademik::where('status', 'Active')->first();
    }

    public function index(Request $request)
    {
        try {
            $query = Booking::query();

            $user = auth()->user();
            if ($user && in_array($user->role, $this->restrictedRoles)) {
                $query->where('user_id', $user->id);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('purpose', 'LIKE', "%{$searchTerm}%");
                $query->orWhere('activity_name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'academic_year', 'status', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($bookings, 'Booking Data Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking data', [$e->getMessage()], 500);
        }
    }

    public function getBookingsForVerification(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user || !in_array($user->role, ['Admin', 'Laboran', 'Kepala Lab Terpadu'])) {
                return $this->sendError('Unauthorized', [], 401);
            }

            $query = Booking::query();
            $query->where('academic_year_id', $this->activeAcademicYear->id);
            // Jika Laboran, filter hanya booking yang laboran_id = user id
            if ($user->role === 'Laboran') {
                $query->where('laboran_id', $user->id);
            }
            // Eager load relations for report context
            $query->with([
                'user.studyProgram',
                'academicYear',
            ]);

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('purpose', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'academic_year', 'status', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);
            $bookings->getCollection()->each(function ($booking) {
                $booking->append(['kepala_lab_approval', 'laboran_approval']);
            });

            return $this->sendResponse($bookings, 'Booking Data Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking data', [$e->getMessage()], 500);
        }
    }

    /**
     * Verify booking (approve / reject)
     */
    public function verify(BookingVerifyRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            if (!$user || !in_array($user->role, ['Laboran', 'Kepala Lab Terpadu'])) {
                DB::rollBack();
                return $this->sendError('Unauthorized', [], 401);
            }

            $booking = Booking::findOrFail($id);
            if ($booking->status !== 'pending') {
                DB::rollBack();
                return $this->sendError('Hanya booking berstatus pending yang dapat diverifikasi', [], 400);
            }

            // validasi role dan status
            $validationError = $this->validateApprovalFlow($booking, $user);
            if ($validationError) {
                DB::rollBack();
                return $this->sendError($validationError, [], 400);
            }

            $action = $request->action;
            $isApprove = $action === 'approve';
            if ($user->role === 'Kepala Lab Terpadu' && $isApprove) {
                $booking->update(['laboran_id' => $request->laboran_id]);
            }

            $isAllowedOffsite = null;
            // Gabungkan logic equipment approval langsung di sini
            if ($user->role === 'Laboran' && $isApprove && $booking->booking_type === 'equipment') {
                $booking->update([
                    'ruangan_laboratorium_id' => $request->ruangan_laboratorium_id,
                ]);
                $isAllowedOffsite = $request->has('is_allowed_offsite') ? $request->is_allowed_offsite : null;
            }

            $approvalData = [
                'booking_id' => $booking->id,
                'role' => $user->role,
                'approver_id' => $user->id,
                'approved' => $isApprove ? 1 : 0,
                'information' => $isApprove ? null : $request->information,
            ];
            if (!is_null($isAllowedOffsite)) {
                $approvalData['is_allowed_offsite'] = $isAllowedOffsite;
            }
            BookingApproval::create($approvalData);

            DB::commit();
            return $this->sendResponse($booking->fresh(), 'Booking ' . ($isApprove ? 'Approved' : 'Rejected') . ' Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify booking', [$e->getMessage()], 500);
        }
    }

    /**
     * Validasi aturan verifikasi berdasarkan role dan approval sebelumnya
     */
    private function validateApprovalFlow($booking, $user): ?string
    {
        if ($user->role === 'Laboran') {
            if (!$booking->kepala_lab_approval_status) {
                return 'Kepala Lab Terpadu harus verifikasi terlebih dahulu.';
            }
            $kepalaLabApproval = $booking->kepala_lab_approval;
            if ($kepalaLabApproval && isset($kepalaLabApproval['approved']) && $kepalaLabApproval['approved'] === false) {
                return 'Kepala Lab Terpadu telah menolak, Laboran tidak dapat verifikasi.';
            }
        }

        if ($user->role === 'Kepala Lab Terpadu' && $booking->kepala_lab_approval_status) {
            return 'Kepala Lab Terpadu sudah melakukan verifikasi.';
        }

        return null; // valid
    }


    public function isStillHaveDraftBooking()
    {
        $query = Booking::where('status', 'draft');
        $user = auth()->user();
        if ($user && in_array($user->role, $this->restrictedRoles)) {
            $query->where('user_id', $user->id);
        }
        $booking = $query->first();

        if ($booking) {
            return $this->sendResponse(1, 'Booking Data Retrieved Successfully');
        }

        return $this->sendError('No draft', [], 404);
    }

    public function store(BookingRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = auth()->user();
            $data['user_id'] = $user->id;
            $data['academic_year_id'] = $this->activeAcademicYear->id;
            $data['supporting_file'] = $this->storeFile($request, 'supporting_file', 'berkas-pendukung');
            $data['start_time'] = Carbon::parse($request->start_time)->format('Y-m-d H:i:s');
            $data['end_time'] = Carbon::parse($request->end_time)->format('Y-m-d H:i:s');

            // Set status: pending only for 'room', draft otherwise
            $isRoom = $request->booking_type === 'room';
            $data['status'] = $isRoom ? 'pending' : 'draft';

            // set ruangan_laboratorium_id to null when type is equipment
            $data['ruangan_laboratorium_id'] = $request->booking_type === 'equipment' ? null : $request->ruangan_laboratorium_id;

            $booking = Booking::create($data);

            // Auto-approve for 'room' bookings
            if ($isRoom) {
                BookingApproval::create([
                    'booking_id' => $booking->id,
                    'role' => 'Peminjam',
                    'approver_id' => $user->id,
                    'approved' => 1
                ]);
            }

            DB::commit();

            // Only send to supervisor if booking type is 'room'
            if ($isRoom) {
                $booking->load(['user.studyProgram']);
                $this->sendToSupervisor($booking);
                return $this->sendResponse($booking, "Pengajuan peminjaman berhasil");
            }

            return $this->sendResponse($booking, "Harap lengkapi data selanjutnya untuk menyelesaikan pengajuan peminjaman");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create bookings', [$e->getMessage()], 500);
        }
    }

    public function getBookingData($id)
    {
        try {
            $booking = Booking::with('user.studyProgram')->findOrFail($id);
            if ($resp = $this->ownershipGuard($booking)) {
                return $resp;
            }
            $booking->load(['laboratoryRoom', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial']);
            return $this->sendResponse($booking, 'Booking Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking', [$e->getMessage()], 500);
        }
    }

    public function getBookingSteps($id)
    {
        try {
            $booking = Booking::with(['approvals.approver'])->findOrFail($id);
            $roles = ['Peminjam', 'Kepala Lab Terpadu', 'Laboran'];
            $stepper = [];
            $allApproved = true;

            foreach ($roles as $role) {
                $approval = $booking->approvals->where('role', $role)->sortByDesc('created_at')->first();
                $status = $approval ? ($approval->approved ? 'approved' : 'rejected') : 'pending';
                $stepper[] = [
                    'role' => $role,
                    'status' => $status,
                    'information' => $approval ? $approval->information : null,
                    'approved_at' => $approval ? $approval->created_at : null,
                    'approver' => $approval && $approval->approver ? $approval->approver->name : null,
                ];

                if ($status !== 'approved') {
                    $allApproved = false;
                }
            }

            if ($allApproved) {
                $stepper[] = [
                    'role' => 'Selesai',
                    'status' => 'approved',
                    'information' => null,
                    'approved_at' => now(),
                    'approver' => null,
                ];
            }
            return $this->sendResponse($stepper, 'Booking Approvals Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve approvals', [$e->getMessage()], 500);
        }
    }

    public function storeBookingRoomNEquipment(BookingEquipmentMaterialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $booking = Booking::with(['equipments', 'materials'])->findOrFail($id);
            if ($resp = $this->ownershipGuard($booking)) {
                DB::rollBack();
                return $resp;
            }

            if (!in_array($booking->status, ['draft', 'pending'])) {
                DB::rollBack();
                return $this->sendError('Status booking tidak mengizinkan penambahan data.', [], 400);
            }

            $data = $request->validated();

            // 2. Prevent duplicate equipments/materials
            if (($booking->equipments && $booking->equipments->count() > 0) || ($booking->materials && $booking->materials->count() > 0)) {
                // If already added, skip inserting new ones (or return error). Here we return error for clarity.
                DB::rollBack();
                return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
            }

            // 3. Insert equipments
            if (!empty($data['laboratoryEquipments'])) {
                foreach ($data['laboratoryEquipments'] as $eq) {
                    BookingEquipment::create([
                        'booking_id' => $booking->id,
                        'alat_laboratorium_id' => $eq['id'],
                        'quantity' => $eq['quantity']
                    ]);
                }
            }

            // 4. Insert materials (respect proper foreign key name if model updated later)
            if (!empty($data['laboratoryMaterials'])) {
                foreach ($data['laboratoryMaterials'] as $mt) {
                    BookingMaterial::create([
                        'booking_id' => $booking->id,
                        'bahan_laboratorium_id' => $mt['id'], // TODO: change to bahan_laboratorium_id if schema requires
                        'quantity' => $mt['quantity']
                    ]);
                }
            }

            // 5. Update status and approval (any creation moves draft -> pending)
            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
            }

            BookingApproval::firstOrCreate([
                'booking_id' => $booking->id,
                'role' => 'Peminjam',
                'approver_id' => auth()->id(),
            ], [
                'approved' => 1
            ]);

            DB::commit();
            $booking->load(['user.studyProgram', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial']);
            $this->sendToSupervisor($booking);
            return $this->sendResponse($booking, 'Pengajuan peminjaman ruangan, alat & bahan berhasil diajukan');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to submit booking data', [$e->getMessage()], 500);
        }
    }

    public function storeBookingEquipment(BookingEquipmentRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $booking = Booking::with(['equipments'])->findOrFail($id);
            if ($resp = $this->ownershipGuard($booking)) {
                DB::rollBack();
                return $resp;
            }

            if (!in_array($booking->status, ['draft', 'pending'])) {
                DB::rollBack();
                return $this->sendError('Status booking tidak mengizinkan penambahan alat.', [], 400);
            }

            if ($booking->equipments && $booking->equipments->count() > 0) {
                DB::rollBack();
                return $this->sendError('Alat sudah pernah ditambahkan.', [], 400);
            }

            $data = $request->validated();
            foreach ($data['laboratoryEquipments'] as $eq) {
                BookingEquipment::create([
                    'booking_id' => $booking->id,
                    'alat_laboratorium_id' => $eq['id'],
                    'quantity' => $eq['quantity']
                ]);
            }

            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
            }

            BookingApproval::firstOrCreate([
                'booking_id' => $booking->id,
                'role' => 'Peminjam',
                'approver_id' => auth()->id(),
            ], [
                'approved' => 1
            ]);

            DB::commit();
            $booking->load(['equipments.laboratoryEquipment', 'user.studyProgram']);
            $this->sendToSupervisor($booking);
            return $this->sendResponse($booking, 'Booking Equipment Submitted Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to submit booking equipments', [$e->getMessage()], 500);
        }
    }

    private function sendToSupervisor($booking)
    {
        if (!empty($booking->supervisor_email)) {
            Mail::to($booking->supervisor_email)->queue(new BookingNotificationSupervisor($booking));
        }
    }

    /**
     * Return unauthorized response if restricted role tries to access others' booking.
     */
    private function ownershipGuard(Booking $booking)
    {
        $user = auth()->user();
        // Allow unrestricted access for admin, laboran, kepala lab terpadu
        if ($user && in_array($user->role, ['Admin', 'Laboran', 'Kepala Lab Terpadu'])) {
            return null;
        }
        // Restrict for other roles
        if ($user && in_array($user->role, $this->restrictedRoles) && $booking->user_id !== $user->id) {
            return $this->sendError('Unauthorized', [], 404);
        }
        return null;
    }

    /**
     * Return stepper info for booking approval process
     */
    private function bookingStepper($id)
    {
        $booking = Booking::with(['approvals.approver'])->findOrFail($id);
        $roles = ['Peminjam', 'Kepala Lab Terpadu', 'Laboran'];
        $stepper = [];
        $allApproved = true;

        foreach ($roles as $role) {
            $approval = $booking->approvals->where('role', $role)->sortByDesc('created_at')->first();
            $status = $approval ? ($approval->approved ? 'approved' : 'rejected') : 'pending';
            $stepper[] = [
                'role' => $role,
                'status' => $status,
                'information' => $approval ? $approval->information : null,
                'approved_at' => $approval ? $approval->created_at : null,
                'approver' => $approval && $approval->approver ? $approval->approver->name : null,
            ];

            if ($status !== 'approved') {
                $allApproved = false;
            }
        }

        if ($allApproved) {
            $stepper[] = [
                'role' => 'Selesai',
                'status' => 'approved',
                'information' => null,
                'approved_at' => now(),
                'approver' => null,
            ];
        }
        return $stepper;
    }
}
