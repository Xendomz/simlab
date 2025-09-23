<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MajorRequest;
use App\Models\Major;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MajorController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = Major::query()->with(['faculty']);

            if ($request->filter_faculty) {
                $query->where('faculty_id', $request->filter_faculty);
            }

            // Add search functionality
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('code', 'LIKE', "%{$searchTerm}%");
                });
                // Add more searchable fields as needed
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $majors = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($majors, 'Data jurusan berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data jurusan', [$e->getMessage()], 500);
        }
    }

    public function store(MajorRequest $request)
    {
        try {
            $major = Major::create($request->validated());
            return $this->sendResponse($major, "Berhasil menambah data jurusan");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data jurusan', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $major = Major::findOrFail($id);
            return $this->sendResponse($major, 'Data jurusan berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jurusan tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data jurusan', [$e->getMessage()], 500);
        }
    }

    public function update(MajorRequest $request, $id)
    {
        try {
            $major = Major::findOrFail($id);
            $major->update($request->validated());

            return $this->sendResponse($major, "Berhasil mengubah data jurusan");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jurusan tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data jurusan', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $major = Major::findOrFail($id);
            $major->delete();

            return $this->sendResponse([], 'Berhasil menghapus data jurusan');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jurusan tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data jurusan', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect() {
        try {
            $majors = Major::select('id', 'name')->get();
            return $this->sendResponse($majors, 'Data jurusan berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data jurusan', [$e->getMessage()], 500);
        }
    }
}
