<?php

namespace App\Http\Requests;

class MajorRequest extends ApiRequest
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
        $id = $this->route('major');
        $uniqueRule = 'unique:majors,code';
        if ($id) {
            $uniqueRule .= ",{$id},id";
        }
        return [
            'faculty_id' => 'required',
            'code' => ["string", "max:255", "min:4", $uniqueRule],
            'name' => "required|string|max:255|min:4"
        ];
    }

    public function messages(): array
    {
        return [
            'faculty_id.required' => 'Fakultas tidak boleh kosong',
            'code.string' => 'Kode Jurusan harus berupa teks',
            'code.max' => 'Kode Jurusan maksimal 255 karakter',
            'code.min' => 'Kode Jurusan minimal 4 karakter',
            'code.unique' => 'Kode Jurusan sudah terdaftar',
            'name.required' => 'Nama Jurusan wajib diisi',
            'name.string' => 'Nama Jurusan harus berupa teks',
            'name.max' => 'Nama Jurusan maksimal 255 karakter',
            'name.min' => 'Nama Jurusan minimal 4 karakter',
        ];
    }
}
