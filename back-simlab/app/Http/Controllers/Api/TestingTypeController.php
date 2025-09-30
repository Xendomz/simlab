<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TestingTypeRequest;
use App\Models\TestingType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TestingTypeController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = TestingType::query();

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
            $testing_types = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($testing_types, 'Data jenis pengujian berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data jenis pengujian', [$e->getMessage()], 500);
        }
    }

    public function store(TestingTypeRequest $request)
    {
        try {
            $testing_type = TestingType::create($request->validated());

            return $this->sendResponse($testing_type, "Berhasil menambah data jenis pengujian");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam menambah data jenis pengujian', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $testing_type = TestingType::findOrFail($id);
            return $this->sendResponse($testing_type, 'Data jenis pengujian berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jenis pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data jenis pengujian', [$e->getMessage()], 500);
        }
    }

    public function update(TestingTypeRequest $request, $id)
    {
        try {
            $testing_type = TestingType::findOrFail($id);
            $testing_type->update($request->validated());

            return $this->sendResponse($testing_type, "Berhasil mengubah data jenis pengujian");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jenis Pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengubah data jenis pengujian', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $testing_type = TestingType::findOrFail($id);
            $testing_type->delete();

            return $this->sendResponse([], 'Berhasil menghapus data jenis pengujian');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Jenis Pengujian tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan dalam mengubah data jenis pengujian', [$e->getMessage()], 500);
        }
    }
}
