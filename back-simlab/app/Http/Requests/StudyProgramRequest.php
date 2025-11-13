<?php

namespace App\Http\Requests;

class StudyProgramRequest extends ApiRequest
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
            'major_id' => 'required|exists:majors,id',
            'name' => 'required|string|max:255|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'major_id.required' => 'Jurusan wajib diisi',
            'major_id.exists' => 'Jurusan tidak ditemukan',
            'name.required' => 'Nama Program Studi wajib diisi',
            'name.string' => 'Nama Program Studi harus berupa teks',
            'name.max' => 'Nama Program Studi maksimal 255 karakter',
            'name.min' => 'Nama Program Studi minimal 4 karakter',
        ];
    }
}
