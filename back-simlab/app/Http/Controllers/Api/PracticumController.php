<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\PracticumRequest;
use App\Models\Practicum;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PracticumController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = Practicum::query()->with('studyProgram');

            if ($request->filter_study_program) {
                $query->where('study_program_id', $request->filter_study_program);
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
            $practicums = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($practicums, 'Data praktikum berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data praktikum', [$e->getMessage()], 500);
        }
    }

    public function store(PracticumRequest $request)
    {
        try {
            $practicum = Practicum::create($request->validated());

            return $this->sendResponse($practicum, 'Berhasil menambah data praktikum');
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data praktikum', [$e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $practicum = Practicum::findOrFail($id);
            return $this->sendResponse($practicum, 'Data praktikum berhasil diambil');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data Praktikum', [$e->getMessage()], 500);
        }
    }

    public function update(PracticumRequest $request, $id)
    {
        try {
            $practicum = Practicum::findOrFail($id);
            $practicum->update($request->validated());

            return $this->sendResponse($practicum, "Berhasil mengubah data praktikum");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengubah data praktikum', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $practicum = Practicum::findOrFail($id);
            $practicum->delete();
            return $this->sendResponse([], "Berhasil menghapus data praktikum");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Praktikum tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data praktikum', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $practicum = Practicum::with(['practicumModules' => function($q) {
                $q->where('status', 'Active')->select('id', 'name', 'practicum_id');
            }])->select('id', 'name')->get();
            return $this->sendResponse($practicum, 'Data Praktikum berhasil diambil');
        } catch (\Exception $e) {
            return $this->sendError("Gagal mengambil data praktikum", [$e->getMessage()], 500);
        }
    }
}
