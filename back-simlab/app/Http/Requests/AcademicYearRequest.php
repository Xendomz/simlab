<?php

namespace App\Http\Requests;

class AcademicYearRequest extends ApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('academic_year');

        $uniqueRule = "unique:academic_years,name";
        if ($id) {
            $uniqueRule .= ",{$id},id";
        }

        return [
            'name' => ['required', 'string', 'max:255', $uniqueRule],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tahun Akademik wajib diisi',
            'name.unique' => 'Tahun Akademik sudah terdaftar',
        ];
    }
}
