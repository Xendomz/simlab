<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacultyRequest extends ApiRequest
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
        $id = $this->route('faculty');
        $uniqueRule = 'unique:faculties,code';
        if ($id) {
            $uniqueRule .= ",{$id},id";
        }
        return [
            'code' => ["nullable", "string", "max:255", "min:2", $uniqueRule],
            'name' => "required|string|max:255|min:4"
        ];
    }

    public function messages(): array
    {
        return [
            'code.string' => 'Kode Fakultas harus berupa teks',
            'code.max' => 'Kode Fakultas maksimal 255 karakter',
            'code.min' => 'Kode Fakultas minimal 2 karakter',
            'code.unique' => 'Kode Fakultas sudah terdaftar',
            'name.required' => 'Nama Fakultas wajib diisi',
            'name.string' => 'Nama Fakultas harus berupa teks',
            'name.max' => 'Nama Fakultas maksimal 255 karakter',
            'name.min' => 'Nama Fakultas minimal 4 karakter',
        ];
    }
}
