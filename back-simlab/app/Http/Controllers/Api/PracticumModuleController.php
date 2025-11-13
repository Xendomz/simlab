<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticumModuleRequest;
use App\Models\PracticumModule;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PracticumModuleController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = PracticumModule::query()->with('practicum');

            if ($request->filter_practicum) {
                $query->where('practicum_id', $request->filter_practicum);
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
            $practicumModules = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($practicumModules, 'Data praktikum berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data praktikum', [$e->getMessage()], 500);
        }
    }

    public function store(PracticumModuleRequest $request)
    {
        try {
            $practicumModule = PracticumModule::create($request->validated());
            return $this->sendResponse($practicumModule, "Berhasi menambah data modul praktikum");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data praktikum', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $practicumModule = PracticumModule::findOrFail($id);
            return $this->sendResponse($practicumModule, "Data modul praktikum berhasil diambil");
        } catch (ModelNotFoundException $th) {
            return $this->sendError("Modul praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data modul praktkum', [$e->getMessage()], 500);
        }
    }

    public function update(PracticumModuleRequest $request, $id)
    {
        try {
            $practicumModule = PracticumModule::findOrFail($id);
            $practicumModule->update($request->validated());

            return $this->sendResponse($practicumModule, "Berhasil mengubah data modul praktikum");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Modul praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Terjadi kesalahan ketika mengubah data modul praktikum", [$e->getMessage()], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $practicumModule = PracticumModule::findOrFail($id);
            $practicumModule->update(['status' => $practicumModule->status == 'Active' ? 'Deactive' : 'Active']);

            return $this->sendResponse($practicumModule, "Berhasil mengubah data modul praktikum");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Modul Praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Terjadi Kesalahan ketika mengubah data modul praktikum");
        }
    }

    public function destroy($id)
    {
        try {
            $practicumModule = PracticumModule::findOrFail($id);
            $practicumModule->delete();

            return $this->sendResponse([], 'Berhasil menghapus modul praktikum');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Modul praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus modul praktikum', [$e->getMessage()], 500);
        }
    }
}
