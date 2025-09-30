<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudyProgramRequest;
use App\Models\StudyProgram;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudyProgramController extends BaseController
{
    public function getPublicStudyProgramData()
    {
        $study_programs = StudyProgram::select('id', 'name')->get();

        return $this->sendResponse($study_programs, "Study Program Retreive Successfully");
    }

    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = StudyProgram::query()->with('major');

            if ($request->filter_major) {
                $query->where('major_id', $request->filter_major);
            }

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
            $study_programs = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($study_programs, "Data program studi berhasil diambil");
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data program studi', [$e->getMessage()], 500);
        }
    }

    public function store(StudyProgramRequest $request)
    {
        try {
            $study_program = StudyProgram::create($request->validated());

            return $this->sendResponse($study_program, "Berhasil menambah data program studi");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menambah data program studi', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $study_program = StudyProgram::findOrFail($id);
            return $this->sendResponse($study_program, 'Data program studi berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Program studi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data program studi', [$e->getMessage()], 500);
        }
    }

    public function update(StudyProgramRequest $request, $id)
    {
        try {
            $study_program = StudyProgram::findOrFail($id);
            $study_program->update($request->validated());

            return $this->sendResponse($study_program, "Berhasil mengubah data program studi");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Program studi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data program studi', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $study_program = StudyProgram::findOrFail($id);
            $study_program->delete();

            return $this->sendResponse([], 'Berhasil menghapus data program studi');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Program studi tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data program studi', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect() {
        try {
            $study_programs = StudyProgram::select('id', 'name')->get();
            return $this->sendResponse($study_programs, 'Data program studi berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data program studi', [$e->getMessage()], 500);
        }
    }
}
