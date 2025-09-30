<?php

namespace App\Http\Requests;

class BookingEquipmentMaterialRequest extends ApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'laboratoryEquipments' => 'required|array|min:1',
            'laboratoryEquipments.*.id' => 'required|distinct|exists:laboratory_equipments,id',
            'laboratoryEquipments.*.quantity' => 'required|integer|min:1',

            'laboratoryMaterials' => 'array',
            'laboratoryMaterials.*.id' => 'required|distinct|exists:laboratory_materials,id',
            'laboratoryMaterials.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'laboratoryEquipments.required' => 'Minimal satu alat harus dipilih.',
            'laboratoryEquipments.array' => 'Data alat harus berupa array.',
            'laboratoryEquipments.min' => 'Minimal satu alat harus dipilih.',
            'laboratoryEquipments.*.id.required' => 'ID alat wajib diisi.',
            'laboratoryEquipments.*.id.distinct' => 'Terdapat duplikasi ID alat.',
            'laboratoryEquipments.*.id.exists' => 'ID alat tidak ditemukan.',
            'laboratoryEquipments.*.quantity.required' => 'Jumlah alat wajib diisi.',
            'laboratoryEquipments.*.quantity.integer' => 'Jumlah alat harus berupa angka.',
            'laboratoryEquipments.*.quantity.min' => 'Jumlah alat minimal 1.',

            'laboratoryMaterials.array' => 'Data bahan harus berupa array.',
            'laboratoryMaterials.*.id.required' => 'ID bahan wajib diisi.',
            'laboratoryMaterials.*.id.distinct' => 'Terdapat duplikasi ID bahan.',
            'laboratoryMaterials.*.id.exists' => 'ID bahan tidak ditemukan.',
            'laboratoryMaterials.*.quantity.required' => 'Jumlah bahan wajib diisi.',
            'laboratoryMaterials.*.quantity.integer' => 'Jumlah bahan harus berupa angka.',
            'laboratoryMaterials.*.quantity.min' => 'Jumlah bahan minimal 1.',
        ];
    }
}
