<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PracticumModuleRequest extends ApiRequest
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
            'practicum_id' => 'required|exists:practicums,id',
            'name' => 'required|string|max:255|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'practicum_id.required' => 'Praktikum wajib diisi',
            'practicum_id.exists' => 'Praktikum tidak ditemukan',
            'name.required' => 'Nama modul wajib diisi',
            'name.string' => 'Nama modul harus berupa teks',
            'name.max' => 'Nama modul maksimal 255 karakter',
            'name.min' => 'Nama modul minimal 4 karakter',
        ];
    }
}
