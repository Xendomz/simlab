<?php

namespace App\Http\Requests;


class BookingVerifyEquipmentRequest extends ApiRequest
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
            'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratorium,id',
            'is_allowed_offsite' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
            'is_allowed_offsite.boolean' => 'Status boleh dibawa keluar harus berupa true/false.',
        ];
    }
}
