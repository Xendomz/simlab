<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudyProgramRequest;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProdiController extends BaseController
{
    public function getPublicStudyProgramData()
    {
        $study_programs = Prodi::select('id', 'name')->get();

        return $this->sendResponse($study_programs, "Study Program Retreive Successfully");
    }

    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = Prodi::query()->with('major');

            if ($request->filter_major) {
                $query->where('jurusan_id', $request->filter_major);
            }

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
                // Add more searchable fields as needed
            }

            // Add sorting functionality
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['id', 'major_code', 'name', 'created_at', 'updated_at'];

            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            // Add filtering (if you have other fields to filter by)
            // Example: if ($request->has('status')) {
            //     $query->where('status', $request->status);
            // }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $study_programs = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($study_programs, "Study Program Retreive Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve study program', [$e->getMessage()], 500);
        }
    }

    public function store(StudyProgramRequest $request)
    {
        try {
            $study_program = Prodi::create($request->validated());

            return $this->sendResponse($study_program, "Berhasil menambah program studi");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menambah program studi', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $study_program = Prodi::findOrFail($id);
            return $this->sendResponse($study_program, 'Study Program Retreived Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Study Program Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve study program', [$e->getMessage()], 500);
        }
    }

    public function update(StudyProgramRequest $request, $id)
    {
        try {
            $study_program = Prodi::findOrFail($id);
            $study_program->update($request->validated());

            return $this->sendResponse($study_program, "Berhasil mengubah program studi");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Program studi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Berhasil mengubah program studi', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $study_program = Prodi::findOrFail($id);
            $study_program->delete();

            return $this->sendResponse([], 'Testing Type Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Testing Type Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete testing type', [$e->getMessage()], 500);
        }
    }
}
