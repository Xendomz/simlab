<?php

namespace App\Http\Requests;

class LaboratoryEquipmentRequest extends ApiRequest
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
        $maxInt = 2147483647; // batas maksimum integer signed 32-bit
        $rules = [
            'laboratory_room_id' => 'required|exists:laboratory_rooms,id',
            'equipment_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|max:50',
            'function' => 'nullable|string',
            'brand' => 'required|string|max:100',
            'equipment_type' => 'required|string|max:100',
            'origin' => 'required|string|max:100',
            'condition' => 'required|string|max:50',
            'condition_description' => 'nullable|string|max:255',
            'asset_code' => 'required|string|max:100',
            'student_price' => 'required|integer|min:0|max:' . $maxInt,
            'lecturer_price' => 'required|integer|min:0|max:' . $maxInt,
            'external_price' => 'required|integer|min:0|max:' . $maxInt,
        ];

        if ($this->hasFile('photo')) {
            $rules['photo'] = 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'laboratory_room_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'laboratory_room_id.exists' => 'Ruangan laboratorium tidak valid.',
            'equipment_name.required' => 'Nama alat wajib diisi.',
            'equipment_name.max' => 'Nama alat maksimal 255 karakter.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'unit.required' => 'Satuan wajib diisi.',
            'unit.max' => 'Satuan maksimal 50 karakter.',
            'brand.required' => 'Merek wajib diisi.',
            'brand.max' => 'Merek maksimal 100 karakter.',
            'equipment_type.required' => 'Tipe alat wajib diisi.',
            'equipment_type.max' => 'Tipe alat maksimal 100 karakter.',
            'origin.required' => 'Asal alat wajib diisi.',
            'origin.max' => 'Asal alat maksimal 100 karakter.',
            'condition.required' => 'Kondisi alat wajib diisi.',
            'condition.max' => 'Kondisi maksimal 50 karakter.',
            'condition_description.max' => 'Keterangan kondisi maksimal 255 karakter.',
            'asset_code.required' => 'Kode aset wajib diisi.',
            'asset_code.max' => 'Kode aset maksimal 100 karakter.',
            'photo.file' => 'Foto harus berupa file.',
            'photo.mimes' => 'Format foto harus JPG, JPEG, PNG, atau WEBP.',
            'photo.max' => 'Ukuran foto maksimal 3 MB.',
            'student_price.required' => 'Harga mahasiswa wajib diisi',
            'student_price.integer' => 'Harga mahasiswa harus berupa angka',
            'student_price.min' => 'Harga mahasiswa minimal 0',
            'student_price.max' => 'Harga mahasiswa maksimal 2.147.483.647',
            'lecturer_price.required' => 'Harga dosen wajib diisi',
            'lecturer_price.integer' => 'Harga dosen harus berupa angka',
            'lecturer_price.min' => 'Harga dosen minimal 0',
            'lecturer_price.max' => 'Harga dosen maksimal 2.147.483.647',
            'external_price.required' => 'Harga eksternal wajib diisi',
            'external_price.integer' => 'Harga eksternal harus berupa angka',
            'external_price.min' => 'Harga eksternal minimal 0',
            'external_price.max' => 'Harga eksternal maksimal 2.147.483.647',
        ];
    }
}
