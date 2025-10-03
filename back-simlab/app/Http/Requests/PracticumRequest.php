<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PracticumRequest extends ApiRequest
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
        $id = $this->route('practicum');
        return [
            'code' => 'required|string|max:50|unique:practicums,code' . ($id ? ',' . $id : ''),
            'name' => 'required|string|max:255|min:4',
            'study_program_id' => 'required',
            'sks' => 'required|numeric|min:1'
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode mata kuliah wajib diisi',
            'code.string' => 'Kode mata kuliah harus berupa teks',
            'code.max' => 'Kode mata kuliah maksimal 50 karakter',
            'code.unique' => 'Kode mata kuliah sudah digunakan',
            'name.required' => 'Nama praktikum wajib diisi',
            'name.string' => 'Nama praktikum harus berupa teks',
            'name.max' => 'Nama praktikum maksimal 255 karakter',
            'name.min' => 'Nama praktikum minimal 4 karakter',
            'study_program_id.required' => 'Prodi wajib diisi',
            'sks.required' => 'SKS wajib diisi',
            'sks.numeric' => 'SKS harus berupa angka',
            'sks.min' => 'SKS minimal 1',
        ];
    }
}
