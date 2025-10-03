<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LaboratoryRoomRequest;
use App\Models\LaboratoryRoom;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaboratoryRoomController extends BaseController
{
    public function index(Request $request)
    {
        try {
            // Start with a base query
            $query = LaboratoryRoom::query()->with('user');

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
            $laboratory_rooms = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_rooms, "Data ruangan laboratorium berhasil diambil");
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengambil data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function store(LaboratoryRoomRequest $request)
    {
        try {
            $laboratory_room = LaboratoryRoom::create($request->validated());

            return $this->sendResponse($laboratory_room, "Berhasil menambah data ruangan laboratorium");
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menambah data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryRoomRequest $request, $id)
    {
        try {
            $laboratory_room = LaboratoryRoom::findOrFail($id);
            $laboratory_room->update($request->validated());

            return $this->sendResponse($laboratory_room, "Berhasil mengubah data ruangan laboratorium");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Ruangan laboratorium tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika mengambil data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_room = LaboratoryRoom::findOrFail($id);
            $laboratory_room->delete();

            return $this->sendResponse([], 'Berhasil menghapus data ruangan laboratorium');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Ruangan Laboratorium tidak ditemukan", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Terjadi kesalahan ketika menghapus data ruangan laboratorium', [$e->getMessage()], 500);
        }
    }

    public function getDataForSelect()
    {
        try {
            $laboratory_rooms = LaboratoryRoom::select('id', 'name')->get();
            return $this->sendResponse($laboratory_rooms, 'Data jenis pengujian berhasil diambil');
        } catch(\Exception $e) {
            return $this->sendError('Gagal mengmbil data ruangan laboratorium', [$e->getMessage()], 400);
        }
    }
}
