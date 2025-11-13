<?php

namespace App\Http\Requests;

class LaboratoryMaterialRequest extends ApiRequest
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
        $id = $this->route('laboratory_material'); // useful for update
        $rules = [
            'code' => "required|string|max:50|unique:laboratory_materials,code," . ($id ?? 'NULL') . ",id",
            'laboratory_room_id' => 'required',
            'material_name' => 'required|string|max:100',
            'brand' => 'nullable|string|max:100',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:100',
            'purchase_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
            'student_price' => 'required|integer|min:0|max:' . $maxInt,
            'lecturer_price' => 'required|integer|min:0|max:' . $maxInt,
            'external_price' => 'required|integer|min:0|max:' . $maxInt,
        ];

        if ($this->input('expiry_date') !== null && $this->input('expiry_date') !== 'null') {
            $rules['expiry_date'] = 'nullable|date|after_or_equal:purchase_date';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode bahan wajib diisi.',
            'code.string' => 'Kode bahan harus berupa teks.',
            'code.max' => 'Kode bahan maksimal 50 karakter.',
            'code.unique' => 'Kode bahan sudah terdaftar.',

            'laboratory_room_id.required' => 'Ruangan laboratorium wajib dipilih.',

            'material_name.required' => 'Nama bahan wajib diisi.',
            'material_name.string' => 'Nama bahan harus berupa teks.',
            'material_name.max' => 'Nama bahan maksimal 100 karakter.',

            'brand.string' => 'Merk bahan harus berupa teks.',
            'brand.max' => 'Merk bahan maksimal 100 karakter.',

            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa angka.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',

            'unit.required' => 'Satuan bahan wajib diisi.',
            'unit.string' => 'Satuan harus berupa teks.',
            'unit.max' => 'Satuan maksimal 100 karakter.',

            'purchase_date.required' => 'Tanggal pembelian wajib diisi.',
            'purchase_date.date' => 'Tanggal pembelian tidak valid.',

            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',

            'expiry_date.date' => 'Tanggal kadaluarsa tidak valid.',
            'expiry_date.after_or_equal' => 'Tanggal kadaluarsa harus sama atau setelah tanggal pembelian.',
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
