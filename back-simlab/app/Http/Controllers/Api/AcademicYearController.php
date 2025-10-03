<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AcademicYearController extends BaseController
{
    /**
     * Display a paginated and filterable list of academic years
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = AcademicYear::query();

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $academicYears = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($academicYears, 'Academic Years Retrieved Successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve academic years', [$e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created academic year
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(AcademicYearRequest $request)
    {
        try {
            $academicYear = AcademicYear::create($request->validated());
            return $this->sendResponse($academicYear, 'Berhasil menambah tahun akademik', 201);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah tahun akademik', [$e->getMessage()], 500);
        }
    }

    /**
     * Display the specified academic year
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $academicYear = AcademicYear::findOrFail($id);
            return $this->sendResponse($academicYear, 'Academic Year Retrieved Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Academic Year Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve academic year', [$e->getMessage()], 500);
        }
    }

    /**
     * Update the specified academic year
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(AcademicYearRequest $request, $id)
    {
        try {
            $academicYear = AcademicYear::findOrFail($id);
            $academicYear->update($request->validated());

            return $this->sendResponse($academicYear, "Berhasil mengubah tahun akademik");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Tahun akademik tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah tahun akademik', [$e->getMessage()], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $academicYear = AcademicYear::findOrFail($id);

            // First deactivate all
            AcademicYear::query()->update(['status' => 'Deactive']);
            // Then activate the selected one
            $academicYear->update(['status' => $academicYear->status == 'Active' ? 'Deactive' : 'Active']);

            return $this->sendResponse($academicYear, "Berhasil mengubah tahun akademik");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Tahun akademik tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah tahun akademik', [$e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified academic year
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $academicYear = AcademicYear::findOrFail($id);
            $academicYear->delete();

            return $this->sendResponse([], 'Berhasil menghapus tahun akademik');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Tahun akademik tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus tahun akademik', [$e->getMessage()], 500);
        }
    }
}
