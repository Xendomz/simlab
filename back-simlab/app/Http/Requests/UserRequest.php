<?php

namespace App\Http\Requests;

class UserRequest extends ApiRequest
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
        $id = $this->route('user'); // If null = create, if set = update

        $rules = [
            'email' => 'required|email|max:191|unique:users,email,' . ($id ?? 'NULL') . ',id',
            'name' => 'required|max:191',
            'password' => ($id ? 'nullable' : 'required') . '|min:8',
            'role' => 'required',
            'identity_num' => 'nullable|string|max:191',
        ];

        if (in_array($this->input('role'), ['dosen', 'kepala_lab_terpadu', 'koorprodi', 'mahasiswa', 'kepala_lab_jurusan'])) {
            $rules['study_program_id'] = 'required';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email tidak boleh kosong!',
            'email.unique' => 'Email tidak boleh sama dengan yang sudah ada!',
            'email.max' => 'Email maksimal 191 karakter!',
            'email.email' => 'Format email tidak valid!',

            'name.required' => 'Nama Akun User tidak boleh kosong!',
            'name.max' => 'Nama Akun User maksimal 191 karakter!',

            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal 8 karakter!',

            'role.required' => 'Peran tidak boleh kosong!',

            'study_program_id.required' => 'Prodi tidak boleh kosong!',

            'identity_num.string' => 'Nomor identitas harus berupa teks!',
            'identity_num.max' => 'Nomor identitas maksimal 191 karakter!',
        ];
    }
}
