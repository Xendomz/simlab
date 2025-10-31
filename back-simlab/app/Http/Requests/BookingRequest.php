<?php

namespace App\Http\Requests;

class BookingRequest extends ApiRequest
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
            'phone_number' => 'required|max:15',
            'purpose' => 'required|max:225',
            'supporting_file' => 'mimes:doc,docx,pdf|max:5046',
            'activity_name' => 'required|max:225',
            'supervisor' => 'max:225|required',
            'supervisor_email' => 'required|max:225|email',
            'start_time' => 'required',
            'end_time' => 'required|after_or_equal:start_time',
            'booking_type' => 'required',
            'total_participant' => 'required|integer|min:1',
            'participant_list' => 'nullable|string',
        ];

        // Add ruangan_laboratorium_id required if booking_type is not null and not 'equipment'
        $bookingType = $this->input('booking_type');
        if (!is_null($bookingType) && $bookingType !== 'equipment') {
            $rules['laboratory_room_id'] = 'required';
        }

        // // If supervisor is filled, supervisor_email is required, and vice versa
        // if ($this->filled('supervisor') && !$this->filled('supervisor_email')) {
        //     $rules['supervisor_email'] .= '|required';
        // }
        // if ($this->filled('supervisor_email') && !$this->filled('supervisor')) {
        //     $rules['supervisor'] .= '|required';
        // }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon tidak boleh lebih dari 15 karakter.',

            'purpose.required' => 'Tujuan peminjaman wajib diisi.',
            'purpose.max' => 'Tujuan peminjaman tidak boleh lebih dari 225 karakter.',

            'supporting_file.mimes' => 'File pendukung harus berupa dokumen bertipe: doc, docx, atau pdf.',
            'supporting_file.max' => 'Ukuran file pendukung tidak boleh melebihi 5MB.',

            'activity_name.required' => 'Nama kegiatan wajib diisi.',
            'activity_name.max' => 'Nama kegiatan tidak boleh lebih dari 225 karakter.',

            'supervisor.max' => 'Nama penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor.required' => 'Nama penanggung jawab wajib diisi.',

            'supervisor_email.max' => 'Email penanggung jawab tidak boleh lebih dari 225 karakter.',
            'supervisor_email.email' => 'Format email penanggung jawab tidak valid.',
            'supervisor_email.required' => 'Email penanggung jawab wajib diisi.',

            'start_time.required' => 'Tanggal & Waktu mulai wajib diisi.',
            'end_time.required' => 'Tanggal & Waktu wajib diisi.',
            'end_time.after_or_equal' => 'Waktu selesai tidak boleh lebih awal dari waktu mulai.',

            'booking_type.required' => 'Jenis peminjaman wajib dipilih.',

            'total_participant.required' => 'Total peserta wajib diisi.',
            'total_participant.integer' => 'Total peserta harus berupa angka.',
            'total_participant.min' => 'Total peserta minimal 1 orang.',

            'participant_list.string' => 'Daftar peserta harus berupa teks.',

            'laboratory_room_id.required' => 'Ruangan laboratorium wajib dipilih.',
        ];
    }
}
