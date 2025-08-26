<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticumEquipmenMaterialRequest;
use App\Http\Requests\PracticumSchedulingRequest;
use App\Models\PracticumApproval;
use App\Models\PracticumGroup;
use App\Models\PracticumScheduling;
use App\Models\PracticumSchedulingEquipment;
use App\Models\PracticumSchedulingMaterial;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PracticumSchedulingController extends BaseController
{
    private $activeAcademicYear;
    private array $restrictedRoles = ['dosen', 'Kepala Lab Terpadu'];

    public function __construct()
    {
        $this->activeAcademicYear = TahunAkademik::where('status', 'Active')->first();
    }

    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = PracticumScheduling::query()->with(['user', 'practicum', 'laboratoryRoom']);

            $user = auth()->user();
            if ($user && in_array($user->role, $this->restrictedRoles)) {
                $query->where('user_id', $user->id);
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

            // Sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'user_id', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

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
            // Start with a base query
            $query = PracticumScheduling::query()->with(['user', 'practicum', 'laboratoryRoom']);

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

            // Sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'user_id', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Pagination parameters
            $perPage = (int) $request->input('per_page', 10);
            $page = (int) $request->input('page', 1);

            // Execute pagination
            $practicumSchedulings = $query->paginate($perPage, ['*'], 'page', $page);
            $practicumSchedulings->getCollection()->each(function ($practicumScheduling) {
                $practicumScheduling->append(['kooprodi_approval', 'kepala_lab_approval', 'laboran_approval']);
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
            $allowedRoles = ['Koorprodi', 'Kepala Lab Terpadu', 'Laboran'];
            if (!$user || !in_array($user->role, $allowedRoles)) {
                DB::rollBack();
                return $this->sendError('Unauthorized', [], 401);
            }

            $practicumScheduling = PracticumScheduling::findOrFail($id);
            $status = $practicumScheduling->status;
            $action = $request->action;
            $isApprove = $action === 'approve';

            if ($status === 'draft') {
                DB::rollBack();
                return $this->sendError('Penjadwalan harus disubmit terlebih dahulu sebelum dapat diverifikasi.', [], 400);
            }

            // Approval order and requirements
            $approvalOrder = [
                'Koorprodi' => null,
                'Kepala Lab Terpadu' => 'Koorprodi',
                'Laboran' => 'Kepala Lab Terpadu',
            ];

            // Check previous approval if needed
            $prevRole = $approvalOrder[$user->role];
            if ($prevRole) {
                $prevApproved = PracticumApproval::where([
                    'practicum_scheduling_id' => $practicumScheduling->id,
                    'role' => $prevRole,
                    'approved' => 1
                ])->exists();
                if (!$prevApproved) {
                    DB::rollBack();
                    return $this->sendError("Penjadwalan harus disetujui oleh $prevRole terlebih dahulu.", [], 400);
                }
            } else {
                // For Koordinator Prodi, must be submitted
                if ($status !== 'submitted') {
                    DB::rollBack();
                    return $this->sendError('Hanya penjadwalan berstatus submitted yang dapat diverifikasi oleh Koordinator Prodi', [], 400);
                }
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
            if ($user->role === 'Kepala Lab Terpadu' && $isApprove && $request->has('laboran_id')) {
                $practicumScheduling->update(['laboran_id' => $request->laboran_id]);
            }
            if ($user->role === 'Laboran' && $isApprove && $request->has('ruangan_laboratorium_id')) {
                $practicumScheduling->update([
                    'ruangan_laboratorium_id' => $request->ruangan_laboratorium_id,
                ]);
            }

            PracticumApproval::create([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => $user->role,
                'approver_id' => $user->id,
                'approved' => $isApprove ? 1 : 0,
                'information' => $isApprove ? null : $request->information,
            ]);

            DB::commit();
            return $this->sendResponse($practicumScheduling->fresh(), 'Practicum Scheduling ' . ($isApprove ? 'Approved' : 'Rejected') . ' Successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->sendError('Practicum Scheduling Not Found', [], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to verify practicum scheduling', [$e->getMessage()], 500);
        }
    }

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
            $groups = $data['groups'] ?? [];
            unset($data['groups']);

            $practicumScheduling = PracticumScheduling::create($data);

            // Create practicum groups
            foreach ($groups as $group) {
                $groupData = [
                    'group_name' => $group['group_name'],
                    'practicum_assistant' => $group['practicum_assistant'],
                    'practicum_session' => $group['practicum_session'],
                    'start_time' => Carbon::parse($group['start_time'])->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::parse($group['end_time'])->format('Y-m-d H:i:s'),
                    'total_participant' => $group['total_participant'],
                    'practicum_scheduling_id' => $practicumScheduling->id,
                ];
                PracticumGroup::create($groupData);
            }

            PracticumApproval::create([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => 'Pengaju',
                'approver_id' => $user->id,
                'approved' => 1
            ]);

            DB::commit();
            return $this->sendResponse($practicumScheduling->load(['user', 'practicum', 'practicumGroups']), "Practicum Scheduling Created Successfully");
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

            if (!in_array($practicumScheduling->status, ['draft', 'pending'])) {
                DB::rollBack();
                return $this->sendError('Status penjadwalan tidak mengizinkan penambahan data.', [], 400);
            }

            $data = $request->validated();
            // Cegah duplikasi
            if (($practicumScheduling->practicumSchedulingEquipments && $practicumScheduling->practicumSchedulingEquipments->count() > 0)
                || ($practicumScheduling->practicumSchedulingMaterials && $practicumScheduling->practicumSchedulingMaterials->count() > 0)
            ) {
                DB::rollBack();
                return $this->sendError('Alat atau bahan sudah pernah ditambahkan.', [], 400);
            }

            // Insert equipments
            if (!empty($data['practicumSchedulingMaterials'])) {
                foreach ($data['practicumSchedulingMaterials'] as $eq) {
                    PracticumSchedulingEquipment::create([
                        'practicum_scheduling_id' => $practicumScheduling->id,
                        'alat_laboratorium_id' => $eq['id'],
                        'quantity' => $eq['quantity']
                    ]);
                }
            }

            // Insert materials
            if (!empty($data['practicumSchedulingMaterials'])) {
                foreach ($data['practicumSchedulingMaterials'] as $mt) {
                    PracticumSchedulingMaterial::create([
                        'practicum_scheduling_id' => $practicumScheduling->id,
                        'bahan_laboratorium_id' => $mt['id'],
                        'quantity' => $mt['quantity']
                    ]);
                }
            }

            // Update status jika draft
            if ($practicumScheduling->status === 'draft') {
                $practicumScheduling->update(['status' => 'submitted']);
            }

            PracticumApproval::firstOrCreate([
                'practicum_scheduling_id' => $practicumScheduling->id,
                'role' => 'Pengaju',
                'approver_id' => auth()->id(),
            ], [
                'approved' => 1
            ]);

            DB::commit();
            $practicumScheduling->load([
                'practicumSchedulingEquipments.laboratoryEquipment',
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
                'practicum',
                'laboratoryRoom',
                'practicumGroups',
                'practicumSchedulingEquipments.laboratoryEquipment',
                'practicumSchedulingMaterials.laboratoryMaterial'
            ])->findOrFail($id);

            return $this->sendResponse($practicumScheduling, 'Practicum Scheduling Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Practicum Scheduling Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve practicum scheduling', [$e->getMessage()], 500);
        }
    }

    // Add equipment to a practicum scheduling
    public function addEquipment(Request $request, $id)
    {
        $request->validate([
            'equipments' => 'required|array|min:1',
            'equipments.*.alat_laboratorium_id' => 'required|exists:alat_laboratorium,id',
            'equipments.*.quantity' => 'required|integer|min:1',
        ]);
        $practicumScheduling = \App\Models\PracticumScheduling::findOrFail($id);
        foreach ($request->equipments as $equipment) {
            $equipment['practicum_scheduling_id'] = $practicumScheduling->id;
            \App\Models\PracticumSchedulingEquipment::create($equipment);
        }
        return $this->sendResponse($practicumScheduling->load('equipments'), 'Equipments added successfully');
    }

    // Add material to a practicum scheduling
    public function addMaterial(Request $request, $id)
    {
        $request->validate([
            'materials' => 'required|array|min:1',
            'materials.*.bahan_laboratorium_id' => 'required|exists:bahan_laboratorium,id',
            'materials.*.quantity' => 'required|integer|min:1',
        ]);
        $practicumScheduling = \App\Models\PracticumScheduling::findOrFail($id);
        foreach ($request->materials as $material) {
            $material['practicum_scheduling_id'] = $practicumScheduling->id;
            \App\Models\PracticumSchedulingMaterial::create($material);
        }
        return $this->sendResponse($practicumScheduling->load('materials'), 'Materials added successfully');
    }
}
