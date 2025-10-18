<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticumEquipmenMaterialRequest;
use App\Http\Requests\PracticumSchedulingRequest;
use App\Http\Resources\PracticumScheduling\PracticumSchedulingResource;
use App\Models\PracticumApproval;
use App\Models\PracticumGroup;
use App\Models\PracticumScheduling;
use App\Models\PracticumSchedulingEquipment;
use App\Models\PracticumSchedulingMaterial;
use App\Models\AcademicYear;
use App\Models\LaboratoryEquipment;
use App\Models\LaboratoryTemporaryEquipment;
use App\Models\PracticumClass;
use App\Models\PracticumSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PracticumSchedulingController extends BaseController
{
    private $activeAcademicYear;

    public function __construct()
    {
        $this->activeAcademicYear = AcademicYear::where('status', 'Active')->first();
    }

    private function isAllowedAccess($practicumData, $user = null)
    {
        if (!$user) {
            $user = auth()->user();
        }

        // Hanya Mahasiswa, Dosen, Pihak Luar yang dibatasi aksesnya
        if (in_array($user->role, ['kepala_lab_jurusan'])) {
            // Hanya boleh akses booking milik sendiri
            if ($practicumData) {
                return $practicumData->user_id === $user->id;
            }
        }
        // Role lain (Admin, Laboran, Kepala Lab Terpadu) boleh akses semua
        return true;
    }

    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = PracticumScheduling::query()->with(['user', 'practicum', 'academicYear']);

            $user = auth()->user();
            $query->where('user_id', $user->id);

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($userQ) use ($searchTerm) {
                        $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                    $q->orWhereHas('practicum', function ($practicumQ) use ($searchTerm) {
                        $practicumQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($practicumSchedulings, "Practicum Scheduling retrieved successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Practicum Scheduling', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSchedulingForVerification(Request $request)
    {
        try {
            $user = auth()->user();

            $query = PracticumScheduling::query()->with(['user', 'practicum', 'academicYear']);
            $query->where('academic_year_id', $this->activeAcademicYear->id);
            $query->where('status', '<>', 'draft');

            if ($user->role === 'laboran') {
                // Restrict to assignments for this laboran
                $query->where('laboran_id', $user->id);

                // Eager-load additional relations laboran needs for verification details
                $query->with([
                    'practicumSchedulingMaterials.laboratoryMaterial',
                ]);
            }

            // Search functionality
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($userQ) use ($searchTerm) {
                        $userQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                    $q->orWhereHas('practicum', function ($practicumQ) use ($searchTerm) {
                        $practicumQ->where('name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);
            $query->orderBy('created_at', 'desc');

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);
            $practicumSchedulings->getCollection()->each(function ($practicumScheduling) {
                $practicumScheduling->append(['kepala_lab_approval', 'laboran_approval']);
            });

            return $this->sendResponse($practicumSchedulings, "Practicum Scheduling retrieved successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Practicum Scheduling', [$e->getMessage()], 500);
        }
    }

    public function verifyPracticumScheduling(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();

            $practicumScheduling = PracticumScheduling::findOrFail($id);
            $status = $practicumScheduling->status;
            $action = $request->action;
            $isApprove = $action === 'approve';
            $isRevision = $action === 'revision';

            if ($status === 'draft') {
                DB::rollBack();
                return $this->sendError('Penjadwalan harus disubmit terlebih dahulu sebelum dapat diverifikasi.', [], 400);
            }

            if ($status !== 'pending') {
                DB::rollBack();
                return $this->sendError('Peminjaman ini telah dilakukan verifikasi sebelumnya', [], 400);
            }

            $validationError = $this->validateApprovalFlow($practicumScheduling, $user);
            if ($validationError) {
                DB::rollBack();
                return $this->sendError($validationError, [], 400);
            }

            // Prevent duplicate approval by same role and user
            $existingApproval = PracticumApproval::where([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => $user->role,
                'approver_id' => $user->id,
            ])->first();
            if ($existingApproval) {
                DB::rollBack();
                return $this->sendError('Anda sudah melakukan verifikasi untuk penjadwalan ini.', [], 400);
            }

            // Special update for Kepala Lab Terpadu and Laboran
            if ($user->role === 'kepala_lab_terpadu' && $isApprove && $request->has('laboran_id')) {
                $practicumScheduling->update(['laboran_id' => $request->laboran_id]);
            }

            if ($user->role === 'laboran' && $isApprove) {
                if ($request->materials) {
                    if (in_array(0, $request->materials)) {
                        DB::rollBack();
                        return $this->sendError('Terdapat bahan yang tidak dapat disediakan', ['materials' => 'Minimal bahan yang disediakan lebih dari 0'], 400);
                    }
                    foreach ($practicumScheduling->practicumSchedulingMaterials as $key => $material) {
                        $material->update(['realization' => $request->materials[$key]]);
                        # code...
                    }
                }

                $practicumScheduling->update(['status' => 'approved']);
            }

            if (!$isApprove) {
                $practicumScheduling->update(['status' => 'rejected']);
            }

            if ($isRevision) {
                $practicumScheduling->update(['status' => 'revision']);
            }

            PracticumApproval::create([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => $user->role,
                'approver_id' => $user->id,
                'is_approved' => $isApprove ? 1 : ($isRevision ? 2 : 0),
                'information' => $request->information,
            ]);

            DB::commit();
            return $this->sendResponse(
                $practicumScheduling->fresh(),
                'Penjadwalan praktikum berhasil ' . ($isApprove ? 'disetujui' : 'ditolak')
            );
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify practicum scheduling', [$e->getMessage()], 500);
        }
    }

    private function validateApprovalFlow($practicumScheduling, $user): ?string
    {
        if ($user->role === 'laboran') {
            if (!$practicumScheduling->kepala_lab_approval) {
                return 'Kepala Lab Terpadu harus verifikasi terlebih dahulu.';
            }
            $kepalaLabApproval = $practicumScheduling->kepala_lab_approval;
            if ($kepalaLabApproval && isset($kepalaLabApproval['approved']) && $kepalaLabApproval['approved'] === false) {
                return 'Kepala Lab Terpadu telah menolak, Laboran tidak dapat verifikasi.';
            }
        }

        if ($user->role === 'kepala_lab_terpadu' && $practicumScheduling->kepala_lab_approval) {
            return 'Kepala Lab Terpadu sudah melakukan verifikasi.';
        }

        return null; // valid
    }

    public function isStillHaveDraftPracticum()
    {
        // Menampilan authenticate user
        $user = auth()->user();

        /*
        Menampilan data booking (peminjaman)
        dengan user berdasakan authenticate user
        */
        $query = PracticumScheduling::where('status', 'draft');
        $query->where('user_id', $user->id);
        $practicumScheduling = $query->first();

        // Menjalankan validasi agar hanya boleh akses booking (peminjaman) milik sendiri
        if (!$this->isAllowedAccess($practicumScheduling, $user)) {
            return $this->sendError('Forbiden', [], 403);
        }

        if ($practicumScheduling) {
            return $this->sendResponse(1, 'Practicum Data Retrieved Successfully');
        }

        return $this->sendError('No draft', [], 404);
    }

    public function store(PracticumSchedulingRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $user = auth()->user();
            $data['user_id'] = $user->id;
            $data['academic_year_id'] = $this->activeAcademicYear->id;
            $data['status'] = 'draft';

            // Remove nested data before creating main scheduling
            $classes = $data['classes'] ?? [];
            unset($data['classes']);

            $practicumScheduling = PracticumScheduling::create($data);

            // Create Practicum Classes
            foreach ($classes as $key => $class) {
                $classData = [
                    'practicum_scheduling_id' => $practicumScheduling->id,
                    'lecturer_id' => $class['lecturer_id'],
                    'laboratory_room_id' => $class['laboratory_room_id'],
                    'name' => $class['name'],
                    'practicum_assistant' => $class['practicum_assistant'],
                    'total_participant' => $class['total_participant'],
                    'total_group' => $class['total_group']
                ];

                // Remove nested data before creating practicum class
                $sessions = $class['sessions'] ?? [];
                unset($data['sessions']);

                $practicumClass = PracticumClass::create($classData);

                // Create practicum sessions
                foreach ($sessions as $key => $session) {
                    $sessionData = [
                        'practicum_class_id' => $practicumClass->id,
                        'practicum_module_id' => $session['practicum_module_id'],
                        'start_time' => Carbon::parse($session['start_time'])->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s'),
                        'end_time' => Carbon::parse($session['end_time'])->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s')
                    ];

                    PracticumSession::create($sessionData);
                }
            }

            PracticumApproval::create([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => 'Pemohon',
                'approver_id' => $user->id,
                'is_approved' => 1
            ]);

            DB::commit();
            return $this->sendResponse($practicumScheduling->load(['user', 'practicum']), "Practicum Scheduling Created Successfully");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function storePracticumEquipmentNMaterial(PracticumEquipmenMaterialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $practicumScheduling = PracticumScheduling::with(['practicumSchedulingEquipments', 'practicumSchedulingMaterials'])->findOrFail($id);
            $user = auth()->user();

            // If current user is laboran, allow adding materials only when they are the assigned laboran.
            $isLaboranAddingMaterials = false;
            if ($user->role === 'laboran') {
                // laboran can only add materials for scheduling assigned to them
                if ($practicumScheduling->laboran_id !== $user->id) {
                    DB::rollBack();
                    return $this->sendError('Anda tidak diizinkan menambah data untuk penjadwalan ini.', [], 403);
                }

                // Laboran may add materials even if status is not draft
                $isLaboranAddingMaterials = true;
            } else {
                // Non-laboran (applicant) can only add when scheduling is draft
                if (!in_array($practicumScheduling->status, ['draft'])) {
                    DB::rollBack();
                    return $this->sendError('Status penjadwalan tidak mengizinkan penambahan data.', [], 400);
                }
            }

            $data = $request->validated();

            // Prevent duplicate additions depending on actor
            if ($isLaboranAddingMaterials) {
                // Laboran: only check for existing materials duplication
                if ($practicumScheduling->practicumSchedulingMaterials && $practicumScheduling->practicumSchedulingMaterials->isNotEmpty()) {
                    DB::rollBack();
                    return $this->sendError('Bahan sudah pernah ditambahkan untuk penjadwalan ini.', [], 400);
                }

                // Only insert materials for laboran
                $this->storeMaterials($practicumScheduling, $data['practicumSchedulingMaterials'] ?? []);
            } else {
                // Applicant (non-laboran): full flow (equipments + proposed + materials)
                // Prevent Duplicated
                if ($this->hasExistingEquipmentOrMaterial($practicumScheduling)) {
                    DB::rollBack();
                    return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
                }

                // Insert equipments (existing laboratory equipments)
                $this->storeEquipments($practicumScheduling, $data['practicumSchedulingEquipments'] ?? []);
                // Insert proposed equipments (temporary equipments stored separately)
                $this->storeProposedEquipments($practicumScheduling, $data['proposedEquipments'] ?? []);
                // Insert materials
                $this->storeMaterials($practicumScheduling, $data['practicumSchedulingMaterials'] ?? []);
            }

            // Update status jika draft
            if ($practicumScheduling->status === 'draft') {
                $practicumScheduling->update(['status' => 'pending']);
            }

            PracticumApproval::firstOrCreate([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => 'Pemohon',
                'approver_id' => auth()->id(),
            ], [
                'approved' => 1
            ]);

            DB::commit();
            $practicumScheduling->load([
                'practicumSchedulingEquipments.equipmentable',
                'practicumSchedulingMaterials.laboratoryMaterial'
            ]);
            return $this->sendResponse($practicumScheduling, 'Practicum Equipment & Material Submitted Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to submit practicum scheduling data', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSchedulingData($id)
    {
        try {
            $practicumScheduling = PracticumScheduling::with([
                'user.studyProgram',
                'laboran',
                'practicum',
                'practicumClasses.lecturer',
                'practicumClasses.practicumSessions.practicumModule',
                'practicumClasses.laboratoryRoom',
                'practicumSchedulingEquipments.equipmentable',
                'practicumSchedulingMaterials.laboratoryMaterial'
            ])->findOrFail($id);

            return $this->sendResponse(new PracticumSchedulingResource($practicumScheduling), 'Practicum Scheduling Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practicum Scheduling Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve practicum scheduling', [$e->getMessage()], 500);
        }
    }

    public function getPracticumSteps($id)
    {
        try {
            $practicumScheduling = PracticumScheduling::with(['practicumApprovals.approver'])->findOrFail($id);
            $roles = ['pemohon', 'kepala_lab_terpadu', 'laboran'];
            $stepper = [];
            $allApproved = true;
            $hasBeenRejected = false;
            foreach ($roles as $role) {
                $approval = $practicumScheduling->practicumApprovals->where('role', $role)->sortByDesc('created_at')->first();
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

            return $this->sendResponse($stepper, 'Practicum Scheduling Approvals Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practicum Scheduling Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve approvals', [$e->getMessage()], 500);
        }
    }


    // Helper
    private function hasExistingEquipmentOrMaterial($scheduling)
    {
        return (
            ($scheduling->practicumSchedulingEquipments && $scheduling->practicumSchedulingEquipments->isNotEmpty()) ||
            ($scheduling->practicumSchedulingMaterials && $scheduling->practicumSchedulingMaterials->isNotEmpty())
        );
    }

    private function storeEquipments($scheduling, array $equipments)
    {
        foreach ($equipments as $eq) {
            PracticumSchedulingEquipment::create([
                'practicum_scheduling_id' => $scheduling->id,
                'quantity' => $eq['quantity'],
                'equipmentable_id' => $eq['id'],
                'equipmentable_type' => LaboratoryEquipment::class,
            ]);
        }
    }

    private function storeProposedEquipments($scheduling, array $proposedEquipments)
    {
        foreach ($proposedEquipments as $p) {
            $temp = LaboratoryTemporaryEquipment::create([
                'name' => $p['name']
            ]);

            PracticumSchedulingEquipment::create([
                'practicum_scheduling_id' => $scheduling->id,
                'quantity' => $p['quantity'],
                'equipmentable_id' => $temp->id,
                'equipmentable_type' => LaboratoryTemporaryEquipment::class,
            ]);
        }
    }

    private function storeMaterials($scheduling, array $materials)
    {
        foreach ($materials as $mt) {
            PracticumSchedulingMaterial::create([
                'practicum_scheduling_id' => $scheduling->id,
                'laboratory_material_id' => $mt['id'],
                'quantity' => $mt['quantity'] * $scheduling->total_groups
            ]);
        }
    }
}
