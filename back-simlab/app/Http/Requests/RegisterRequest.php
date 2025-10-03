<?php

namespace App\Http\Requests;

class RegisterRequest extends ApiRequest
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
        $rules = [
            'name' => 'required|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'identity_num' => 'required|max:100',
            'role' => 'required',
            'password' => 'required|min:8',
            'c_password' => 'required|same:password',
        ];

        // Conditional rule: if role is not "Pihak Luar", require prodi_id
        if ($this->input('role') !== 'pihak_luar') {
            $rules['study_program_id'] = 'required';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong!',
            'name.max' => 'Nama maksimal 191 karakter!',

            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.max' => 'Email maksimal 191 karakter!',
            'email.unique' => 'Email sudah terdaftar!',

            'identity_num.required' => 'NIM / NIP / NIPH / Identitas lainnya tidak boleh kosong!',
            'identity_num.max' => 'Identitas maksimal 100 karakter!',

            'role.required' => 'Silakan pilih peran terlebih dahulu!',

            'password.required' => 'Password tidak boleh kosong!',
            'password.min' => 'Password minimal 8 karakter!',

            'c_password.required' => 'Konfirmasi password tidak boleh kosong!',
            'c_password.same' => 'Konfirmasi password tidak cocok dengan password!',

            'study_program_id.required' => 'Program Studi harus diisi jika bukan pihak eksternal!',
        ];
    }
}
