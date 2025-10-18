<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\FacultyRequest;
use App\Models\Faculty;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class FacultyController extends BaseController
{
    /**
     * Display a paginated and filterable list of FacultyC
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = Faculty::query();

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
            $faculties = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($faculties, 'Data fakultas berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data fakultas', [$e->getMessage()], 500);
        }
    }

    public function store(FacultyRequest $request)
    {
        try {
            $faculty = Faculty::create($request->validated());
            return $this->sendResponse($faculty, "Berhasil menambah data fakultas");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika manambah data fakultas', [$e->getMessage()], 500);
        }
    }

    public function show($id) {
        try {
            $faculty = Faculty::findOrFail($id);
            return $this->sendResponse($faculty, "Data fakultas berhasil diambil");
        } catch (ModelNotFoundException $e) {
            return $this->sendError('Fakultas tidak ditemukan', [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data fakultas', [$e->getMessage()], 500);
        }
    }

    public function update(FacultyRequest $request, $id)
    {
        try {
            $faculty = Faculty::findOrFail($id);
            $faculty->update($request->validated());

            return $this->sendResponse($faculty, "Berhasil mengubah data fakultas");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Fakultas tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Terjadi kesalahan ketika mengubah data fakultas", [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $faculty = Faculty::findOrFail($id);
            $faculty->delete();

            return $this->sendResponse([], "Berhasil menghapus data fakultas");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Fakultas tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Terjadi kesalahan ketika menghapus data fakultas", [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $faculties = Faculty::select('id', 'name')->get();
            return $this->sendResponse($faculties, 'Data fakultas berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data fakultas', [$e->getMessage()], 500);
        }
    }
}
