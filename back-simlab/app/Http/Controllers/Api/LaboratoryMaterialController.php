<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LaboratoryMaterialRequest;
use App\Models\LaboratoryMaterial;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class LaboratoryMaterialController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $query = LaboratoryMaterial::query()->with('laboratoryRoom');

            if ($request->filter_laboratory_room) {
                $query->where('laboratory_room_id', $request->filter_laboratory_room);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('material_name', 'LIKE', "%{$searchTerm}%");
            }

            // Get pagination parameters with defaults
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Execute pagination
            $laboratory_materials = $query->paginate($perPage, ['*'], 'page', $page);

            return $this->sendResponse($laboratory_materials, "Laboratory Materials Retreive Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve Laboratory Materials', [$e->getMessage()], 500);
        }
    }

    public function store(LaboratoryMaterialRequest $request)
    {
        try {
            $data = $request->validated();
            $data['purchase_date'] = $this->convertIsoStringToDate($request->purchase_date);
            $data['refill_date'] = now();
            $data['expiry_date'] = $request->expiry_date != 'null' ? $this->convertIsoStringToDate($request->expiry_date) : null;
            $laboratory_material = LaboratoryMaterial::create($data);

            return $this->sendResponse($laboratory_material, "Laboratory Material Created Successfully");
        } catch (\Exception $e) {
            return $this->sendError('Failed to create Laboratory Material', [$e->getMessage()], 500);
        }
    }

    public function update(LaboratoryMaterialRequest $request, $id)
    {
        try {
            $laboratory_material = LaboratoryMaterial::findOrFail($id);
            $data = $request->validated();
            $data['refill_date'] = now();
            $data['expiry_date'] = $request->expiry_date != 'null' ? $request->expiry_date : null;
            $laboratory_material->update($data);

            return $this->sendResponse($laboratory_material, "Laboratory Material Updated Successfully");
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Material Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update Laboratory Material', [$e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $laboratory_material = LaboratoryMaterial::findOrFail($id);

            $laboratory_material->delete();

            return $this->sendResponse([], 'Laboratory Material Deleted Successfully');
        } catch (ModelNotFoundException $e) {
            return $this->sendError("Laboratory Material Not Found", [], 404);
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete Laboratory Material', [$e->getMessage()], 500);
        }
    }
}
