<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\BookingRequest;
use App\Http\Requests\BookingEquipmentMaterialRequest;
use App\Http\Requests\BookingEquipmentRequest;
use App\Http\Requests\BookingVerifyRequest;
use App\Mail\BookingNotification;
use App\Mail\BookingNotificationKepalaLabApproved;
use App\Mail\BookingNotificationLaboranApproved;
use App\Mail\BookingNotificationRejected;
use App\Mail\BookingNotificationSupervisor;
use App\Models\Booking;
use App\Models\BookingApproval;
use App\Models\BookingEquipment;
use App\Models\BookingMaterial;
use App\Models\AcademicYear;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BookingController extends BaseController
{
    private $activeAcademicYear;
    private $currentKepalaLab;

    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('status', 'Active')->first();
        $this->currentKepalaLab = User::where('role', 'kepala_lab_terpadu')->first();
    }

    private function isAllowedAccess($bookingData, $user = null)
    {
        if (!$user) {
            $user = auth()->user();
        }

        // Hanya Mahasiswa, Dosen, Pihak Luar yang dibatasi aksesnya
        if (in_array($user->role, ['Mahasiswa', 'Dosen', 'Pihak Luar'])) {
            // Hanya boleh akses booking milik sendiri
            if ($bookingData) {
                return $bookingData->user_id === $user->id;
            }
        }
        // Role lain (Admin, Laboran, Kepala Lab Terpadu) boleh akses semua
        return true;
    }

    public function index(Request $request)
    {
        try {
            $query = Booking::query();

            $user = auth()->user();
            $query->where('user_id', $user->id);

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

            if ($request->has('search') && strlen($request->search) > 0) {
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

            $query = Booking::query();
            $query->where('academic_year_id', $this->activeAcademicYear->id);
            $query->where('status', '<>' , 'draft');

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

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
            $booking = Booking::findOrFail($id);
            if ($booking->status !== 'pending') {
                DB::rollBack();
                return $this->sendError('Peminjaman ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            // validasi role dan status
            $validationError = $this->validateApprovalFlow($booking, $user);
            if ($validationError) {
                DB::rollBack();
                return $this->sendError($validationError, [], 400);
            }

            // $isApprove: 1 = approve, 2 = revision, 0 = reject/other
            if ($request->action === 'approve') {
                $isApprove = 1;
            } elseif ($request->action === 'revision') {
                $isApprove = 2;
            } else {
                $isApprove = 0;
            }

            $this->assignBookingDataByRole($booking, $user, $request, $isApprove);

            $this->storeApproval($booking, $user, $request, $isApprove);

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


    private function storeApproval($booking, $user, $request, bool $isApprove)
    {
        // Siapkan data dasar untuk disimpan ke tabel booking_approvals.
        $approvalData = [
            'booking_id' => $booking->id,
            'role' => $user->role,
            'approver_id' => $user->id,
            'is_approved' => $isApprove ? 1 : 0,
            'information' => $request->information ?? null,
        ];

        // Khusus untuk Laboran yang menyetujui peminjaman alat, kita perlu
        // mencatat izin apakah alat boleh dibawa ke luar lab atau tidak.
        if ($user->role === 'laboran' && $isApprove && $booking->booking_type === 'equipment') {
            $approvalData['is_allowed_offsite'] = $request->boolean('is_allowed_offsite');
        }

        BookingApproval::create($approvalData);
    }

    /**
     * Tangani perubahan kebutuhan peminjaman berdasarkan role.
     */
    private function assignBookingDataByRole($booking, $user, $request, bool $isApprove)
    {
        if ($user->role === 'kepala_lab_terpadu' && $isApprove) {
            $booking->update(['laboran_id' => $request->laboran_id]);
            $laboran = User::find($request->laboran_id);
            Mail::to($laboran->email)->queue(new BookingNotificationKepalaLabApproved($laboran, $booking));
        }

        if ($user->role === 'laboran' && $isApprove && $booking->booking_type === 'equipment') {
            $booking->update([
                'laboratory_room_id' => $request->laboratory_room_id,
            ]);
        }

        if (!$isApprove) {
            $booking->update(['status' => 'rejected']);
            Mail::to($user->email)->queue(new BookingNotificationRejected($booking->user, $booking, $request->information));
        } elseif ($user->role == 'laboran' && $isApprove) {
            $booking->update(['status' => 'approved']);
            Mail::to($booking->user->email)->queue(new BookingNotificationLaboranApproved($booking->user, $booking));
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
        // Menampilan authenticate user
        $user = auth()->user();

        /*
        Menampilan data booking (peminjaman)
        dengan user berdasakan authenticate user
        */
        $query = Booking::where('status', 'draft');
        $query->where('user_id', $user->id);
        $booking = $query->first();

        // Menjalankan validasi agar hanya boleh akses booking (peminjaman) milik sendiri
        if (!$this->isAllowedAccess($booking, $user)) {
            return $this->sendError('Forbiden', [], 403);
        }

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
            $data['start_time'] = $request->start_time;
            $data['end_time'] = $request->end_time;

            // Set status: pending only for 'room', draft otherwise
            $isRoom = $request->booking_type === 'room';
            if ($isRoom) {
                $data['status'] = 'pending';
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
            } else {
                $data['status'] = 'draft';
            }

            // set ruangan_laboratorium_id to null when type is equipment
            $data['laboratory_room_id'] = $request->booking_type === 'equipment' ? null : $request->laboratory_room_id;

            $booking = Booking::create($data);
            if ($isRoom) {
                // Auto-approve for 'room' bookings
                BookingApproval::create([
                    'booking_id' => $booking->id,
                    'role' => 'pemohon',
                    'approver_id' => $user->id,
                    'is_approved' => 1
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
            return $this->sendError('Terjadi kesalahan dalam pengajuan peminjaman', [$e->getMessage()], 500);
        }
    }

    public function getBookingData($id)
    {
        try {
            // Mendapatkan data booking (peminjaman) berdasarkan id
            $booking = Booking::with('user.studyProgram')->findOrFail($id);

            if (!$this->isAllowedAccess($booking)) {
                return $this->sendError('Forbiden', [], 403);
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
            $roles = ['pemohon', 'kepala_lab_terpadu', 'laboran'];
            $stepper = [];
            $allApproved = true;
            $hasBeenRejected = false;
            foreach ($roles as $role) {
                $approval = $booking->approvals->where('role', $role)->sortByDesc('created_at')->first();
                if ($approval) {
                    // Normalize status: 1 = approved, 2 = revision, 0 = rejected
                    if ($approval->is_approved === 1) {
                        $status = 'approved';
                    } elseif ($approval->is_approved === 2) {
                        $status = 'revision';
                    } elseif ($approval->is_approved === 0) {
                        $status = 'rejected';
                        $hasBeenRejected = true;
                    } else {
                        $status = 'pending';
                    }
                } else {
                    $status = $hasBeenRejected ? 'rejected' : 'pending';
                }

                $stepper[] = [
                    'role' => ucwords(str_replace('_', ' ', $role)),
                    'status' => $status,
                    'information' => $approval?->information,
                    'approved_at' => $approval?->created_at ? Carbon::parse($approval->created_at)->setTimezone(config('app.timezone'))->toIso8601String() : null,
                    'approver' => $approval?->approver?->name,
                ];

                if ($status !== 'approved') {
                    $allApproved = false;
                }
            }

            $stepper[] = [
                'role' => 'Selesai',
                'status' => $allApproved ? 'approved' : ($hasBeenRejected ? 'rejected' : 'pending'),
                'information' => null,
                'approved_at' => null,
                'approver' => null,
            ];

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

            // Menjalankan validasi agar hanya boleh akses booking (peminjaman) milik sendiri
            if (!$this->isAllowedAccess($booking)) {
                DB::rollBack();
                return $this->sendError('Forbiden', [], 403);
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
                        'laboratory_equipment_id' => $eq['id'],
                        'quantity' => $eq['quantity']
                    ]);
                }
            }

            // 4. Insert materials (respect proper foreign key name if model updated later)
            if (!empty($data['laboratoryMaterials'])) {
                foreach ($data['laboratoryMaterials'] as $mt) {
                    BookingMaterial::create([
                        'booking_id' => $booking->id,
                        'laboratory_material_id' => $mt['id'], // TODO: change to bahan_laboratorium_id if schema requires
                        'quantity' => $mt['quantity']
                    ]);
                }
            }

            // 5. Update status and approval (any creation moves draft -> pending)
            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
            }

            BookingApproval::firstOrCreate([
                'booking_id' => $booking->id,
                'role' => 'pemohon',
                'approver_id' => auth()->id(),
            ], [
                'is_approved' => 1
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

            if (!$this->isAllowedAccess($booking)) {
                DB::rollBack();
                return $this->sendError('Forbiden', [], 403);
            }

            if (!in_array($booking->status, ['draft', 'pending'])) {
                DB::rollBack();
                return $this->sendError('Peminjaman sudah disubmit dan tidak mengizinkan penambahan alat.', [], 400);
            }

            if ($booking->equipments && $booking->equipments->count() > 0) {
                DB::rollBack();
                return $this->sendError('Alat sudah pernah ditambahkan.', [], 400);
            }

            $data = $request->validated();
            foreach ($data['laboratoryEquipments'] as $eq) {
                BookingEquipment::create([
                    'booking_id' => $booking->id,
                    'laboratory_equipment_id' => $eq['id'],
                    'quantity' => $eq['quantity']
                ]);
            }

            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
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
            return $this->sendResponse($booking, 'Peminjaman berhasi diajukan');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Data peminjaman tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan dalam pengajuan peminjaman', [$e->getMessage()], 500);
        }
    }

    private function sendToSupervisor($booking)
    {
        if (!empty($booking->supervisor_email)) {
            Mail::to($booking->supervisor_email)->queue(new BookingNotificationSupervisor($booking));
        }
    }
}
