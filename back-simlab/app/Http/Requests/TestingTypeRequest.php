<?php

namespace App\Http\Requests;

class TestingTypeRequest extends ApiRequest
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
        return [
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:255',
            'student_price' => 'required|integer|min:0|max:' . $maxInt,
            'lecturer_price' => 'required|integer|min:0|max:' . $maxInt,
            'external_price' => 'required|integer|min:0|max:' . $maxInt,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama jenis pengujian wajib diisi',
            'name.string' => 'Nama jenis pengujian harus berupa teks',
            'name.max' => 'Nama jenis pengujian maksimal 255 karakter',
            'unit.required' => 'Satuan wajib diisi',
            'unit.string' => 'Satuan harus berupa teks',
            'unit.max' => 'Satuan maksimal 255 karakter',
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
