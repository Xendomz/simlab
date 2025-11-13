<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PracticumSchedulingSessionConductedRequest extends ApiRequest
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
            'session_id' => 'required|integer|exists:practicum_sessions,id',
            'status' => 'required|boolean',
            'information' => 'nullable|string|max:255'
        ];
    }

    /**
     * Custom validation messages in Indonesian.
     *
     * @return array<string,string>
     */
    public function messages(): array
    {
        return [
            'session_id.required' => 'ID sesi harus diisi.',
            'session_id.integer' => 'ID sesi harus berupa angka.',
            'session_id.exists' => 'Sesi praktikum yang dipilih tidak ditemukan.',

            'status.required' => 'Status harus diisi.',
            'status.boolean' => 'Status harus berupa nilai benar atau salah.',

            'information.string' => 'Catatan harus berupa teks.',
            'information.max' => 'Catatan tidak boleh lebih dari :max karakter.',
        ];
    }
}
