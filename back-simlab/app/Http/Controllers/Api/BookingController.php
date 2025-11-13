<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\BookingRequest;
use App\Http\Requests\BookingEquipmentMaterialRequest;
use App\Http\Requests\BookingEquipmentRequest;
use App\Http\Requests\BookingReturnRequest;
use App\Http\Requests\BookingVerifyRequest;
use App\Http\Resources\BookingApprovalResource;
use App\Http\Resources\BookingResource;
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

    public function index(Request $request)
    {
        try {
            $query = Booking::query();

            $query->with([
                'academicYear'
            ]);

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

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);

            $response = [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'data' => BookingResource::collection($bookings)
            ];

            return $this->sendResponse($response, 'Booking Data Retrieved Successfully');
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
            $query->where('status', '<>', 'draft');

            if ($request->filter_status) {
                $query->where('status', $request->filter_status);
            }

            // Jika Laboran, filter hanya booking yang laboran_id = user id
            if ($user->role === 'laboran') {
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

            $query->orderBy('created_at', 'desc');

            $bookings = $query->paginate($perPage, ['*'], 'page', $page);
            $response = [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'data' => BookingResource::collectionWithApprovals($bookings)
            ];

            return $this->sendResponse($response, 'Booking Data Retrieved Successfully');
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
                return $this->sendError('Peminjaman ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            // validasi role dan status
            $validationError = $this->validateApprovalFlow($booking, $user);
            if ($validationError) {
                return $this->sendError($validationError, [], 400);
            }

            // $isApprove: 1 = approve, 2 = revision, 0 = reject/other
            $isApprove = $request->action === 'approve' ? 1 : ($request->action === 'revision' ? 2 : 0);
            $this->assignBookingDataByRole($booking, $user, $request, $isApprove);

            $approvalAction = $user->role === 'laboran' ? 'verified_by_laboran' : 'verified_by_head';
            $this->recordApproval($booking->id, $approvalAction, $user->id, $isApprove, $request->information);

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

    public function bookingReturnVerification(BookingReturnRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $booking = Booking::findOrFail($id);
            if ($booking->status !== 'approved') {
                return $this->sendError('Verifikai pengembalian hanya bisa dilakukan jika status peminjaman disetujui', [], 400);
            }

            // validasi role dan status
            if ($user->role === 'laboran' && $booking->laboran_id !== $user->id) {
                return $this->sendError('Hanya Laboran yang bertanggung jawab yang bisa melakukan verifikasi ini', [], 400);
            }

            // $isApprove: 1 = approve, 2 = revision, 0 = reject/other
            $this->recordApproval($booking->id, 'returned_by_requestor', $user->id, 1);
            $this->recordApproval($booking->id, 'return_confirmed_by_laboran', $user->id, 1, $request->information);

            $booking->update(['status' => 'returned']);

            DB::commit();
            return $this->sendResponse($booking->fresh(), 'Booking Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Booking Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify booking', [$e->getMessage()], 500);
        }
    }

    private function assignBookingDataByRole($booking, $user, $request, $isApprove)
    {
        // Booking is REJECTED
        if (! $isApprove) {
            $booking->update(['status' => 'rejected']);

            // Notify applicant about rejection
            Mail::to($booking->user->email)
                ->queue(new BookingNotificationRejected($booking->user, $booking, $request->information ?? null));

            return;
        }

        // Booking is APPROVED
        switch ($user->role) {
            case 'kepala_lab_terpadu':
                // Assign laboran to the booking
                $booking->update(['laboran_id' => $request->laboran_id]);

                // Notify the assigned laboran
                if ($laboran = User::find($request->laboran_id)) {
                    Mail::to($laboran->email)
                        ->queue(new BookingNotificationKepalaLabApproved($laboran, $booking));
                }
                break;

            case 'laboran':
                // Update lab room if type is equipment
                if ($booking->booking_type === 'equipment') {
                    $booking->update([
                        'laboratory_room_id' => $request->laboratory_room_id,
                        'is_allowed_offsite' => $request->boolean('is_allowed_offsite')
                    ]);
                }

                // Final approval (laboran confirms everything)
                $booking->update(['status' => 'approved']);

                // Notify applicant that the booking is approved
                Mail::to($booking->user->email)
                    ->queue(new BookingNotificationLaboranApproved($booking->user, $booking));
                break;
        }
    }


    private function validateApprovalFlow($booking, $user): ?string
    {
        if ($user->role === 'laboran') {
            if ($booking->laboran_id !== $user->id) {
                return $this->sendError('Hanya Laboran yang bertanggung jawab yang bisa melakukan verifikasi ini', [], 400);
            }

            if (!$booking->kepala_lab_approval) {
                return 'Kepala Lab Terpadu harus verifikasi terlebih dahulu.';
            }
            $kepalaLabApproval = $booking->kepala_lab_approval;
            if ($kepalaLabApproval && isset($kepalaLabApproval['approved']) && $kepalaLabApproval['approved'] === false) {
                return 'Kepala Lab Terpadu telah menolak, Laboran tidak dapat verifikasi.';
            }
        }

        if ($user->role === 'kepala_lab_terpadu' && $booking->kepala_lab_approval) {
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
                $this->recordApproval($booking->id, 'request_booking', $user->id, 1);
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
            $booking = Booking::with(['user', 'laboratoryRoom', 'laboran', 'equipments.laboratoryEquipment', 'materials.laboratoryMaterial'])->findOrFail($id);

            return $this->sendResponse(new BookingResource($booking), 'Booking Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking', [$e->getMessage()], 500);
        }
    }

    public function getBookingApprovals($id)
    {
        try {
            $booking = Booking::with(['approvals.approver'])->findOrFail($id);
            return $this->sendResponse(BookingApprovalResource::collection($booking->approval_steps), 'Booking Approvals Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Booking Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve approvals', [$e->getMessage()], 500);
        }
    }

    public function storeBookingEquipmentMaterial(BookingEquipmentMaterialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $booking = Booking::with(['equipments', 'materials'])->findOrFail($id);

            if (!in_array($booking->status, ['draft'])) {
                DB::rollBack();
                return $this->sendError('Status booking tidak mengizinkan penambahan data.', [], 400);
            }

            $data = $request->validated();

            // 2. Prevent duplicate equipments/materials
            if ($this->hasExistingEquipmentOrMaterial($booking)) {
                DB::rollBack();
                return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
            }

            // 3. Insert equipments
            $this->storeEquipments($booking->id, $data['laboratoryEquipments']);

            // 4. Insert materials
            $this->storeMaterials($booking->id, $data['laboratoryMaterials']);

            // 5. Update status and approval (any creation moves draft -> pending)
            if ($booking->status === 'draft') {
                $booking->update(['status' => 'pending']);
                Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());
            }

            $this->recordApproval($booking->id, 'request_booking', auth()->id(), 1);

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

            if (!in_array($booking->status, ['draft'])) {
                DB::rollBack();
                return $this->sendError('Peminjaman sudah disubmit dan tidak mengizinkan penambahan alat.', [], 400);
            }

            if ($booking->equipments && $booking->equipments->count() > 0) {
                DB::rollBack();
                return $this->sendError('Alat sudah pernah ditambahkan.', [], 400);
            }

            $data = $request->validated();
            $this->storeEquipments($booking->id, $data['laboratoryEquipments']);

            $booking->update(['status' => 'pending']);
            Mail::to($this->currentKepalaLab->email)->queue(new BookingNotification());

            $this->recordApproval($booking->id, 'request_booking', auth()->id(), 1);

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

    // Helper
    private function recordApproval($bookingId, $action, $approverId, $status, $information = null)
    {
        BookingApproval::create([
            'booking_id' => $bookingId,
            'action' => $action,
            'approver_id' => $approverId,
            'is_approved' => $status,
            'information' => $information
        ]);
    }

    private function hasExistingEquipmentOrMaterial($booking)
    {
        return (
            ($booking->equipments && $booking->equipments->isNotEmpty()) ||
            ($booking->materials && $booking->materials->isNotEmpty())
        );
    }

    private function storeEquipments($bookingId, array $equipments)
    {
        foreach ($equipments as $equipment) {
            BookingEquipment::create([
                'booking_id' => $bookingId,
                'laboratory_equipment_id' => $equipment['id'],
                'quantity' => $equipment['quantity']
            ]);
        }
    }

    private function storeMaterials($bookingId, array $materials)
    {
        foreach ($materials as $material) {
            BookingMaterial::create([
                'booking_id' => $bookingId,
                'laboratory_material_id' => $material['id'], // TODO: change to bahan_laboratorium_id if schema requires
                'quantity' => $material['quantity']
            ]);
        }
    }

    private function sendToSupervisor($booking)
    {
        if (!empty($booking->supervisor_email)) {
            Mail::to($booking->supervisor_email)->queue(new BookingNotificationSupervisor($booking));
        }
    }
}
