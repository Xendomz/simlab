<?php

namespace App\Http\Requests;


class PracticumEquipmenMaterialRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Alat (equipments) tidak required, hanya validasi jika ada
            'practicumSchedulingEquipments' => 'array',
            'practicumSchedulingEquipments.*.id' => 'required|distinct|exists:laboratory_equipments,id',
            'practicumSchedulingEquipments.*.quantity' => 'required|integer|min:1',

            // Bahan (materials) tidak required, hanya validasi jika ada
            'practicumSchedulingMaterials' => 'array',
            'practicumSchedulingMaterials.*.id' => 'required|distinct|exists:laboratory_materials,id',
            'practicumSchedulingMaterials.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            // Alat
            'practicumSchedulingEquipments.array' => 'Data alat harus berupa array.',
            'practicumSchedulingEquipments.*.id.required' => 'ID alat wajib diisi.',
            'practicumSchedulingEquipments.*.id.distinct' => 'Terdapat duplikasi ID alat.',
            'practicumSchedulingEquipments.*.id.exists' => 'ID alat tidak ditemukan.',
            'practicumSchedulingEquipments.*.quantity.required' => 'Jumlah alat wajib diisi.',
            'practicumSchedulingEquipments.*.quantity.integer' => 'Jumlah alat harus berupa angka.',
            'practicumSchedulingEquipments.*.quantity.min' => 'Jumlah alat minimal 1.',

            // Bahan
            'practicumSchedulingMaterials.array' => 'Data bahan harus berupa array.',
            'practicumSchedulingMaterials.*.id.required' => 'ID bahan wajib diisi.',
            'practicumSchedulingMaterials.*.id.distinct' => 'Terdapat duplikasi ID bahan.',
            'practicumSchedulingMaterials.*.id.exists' => 'ID bahan tidak ditemukan.',
            'practicumSchedulingMaterials.*.quantity.required' => 'Jumlah bahan wajib diisi.',
            'practicumSchedulingMaterials.*.quantity.integer' => 'Jumlah bahan harus berupa angka.',
            'practicumSchedulingMaterials.*.quantity.min' => 'Jumlah bahan minimal 1.',
        ];
    }
}
