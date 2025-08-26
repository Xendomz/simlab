<?php

namespace App\Http\Requests;

use App\Models\Booking;

class BookingVerifyRequest extends ApiRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $user = $this->user();
        $laboranIdRule = 'exists:users,id';
        if (!$user || $user->role !== 'Laboran') {
            $laboranIdRule = 'required_if:action,approve|' . $laboranIdRule;
        } else {
            // Laboran tidak perlu input laboran_id saat approve
            $laboranIdRule = 'nullable|' . $laboranIdRule;
        }

        $rules = [
            'action' => 'required|in:approve,reject',
            'laboran_id' => $laboranIdRule,
            'information' => 'required_if:action,reject|string|filled',
        ];

        // Ambil booking_type dari payload, jika tidak ada ambil dari database
        $bookingType = $this->input('booking_type');
        if (!$bookingType && $this->route('id')) {
            $booking = Booking::find($this->route('id'));
            $bookingType = $booking ? $booking->booking_type : null;
        }

        // Equipment approval: jika approve, role Laboran, dan booking_type equipment
        if (
            $this->input('action') === 'approve'
            && $user && $user->role === 'Laboran'
            && $bookingType === 'equipment'
        ) {
            $rules['ruangan_laboratorium_id'] = 'required|exists:ruangan_laboratoria,id';
            $rules['is_allowed_offsite'] = 'nullable|boolean';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'laboran_id.required_if' => 'Pilih laboran terlebih dahulu untuk melakukan persetujuan.',
            'laboran_id.exists' => 'Laboran yang dipilih tidak ditemukan.',
            'information.required_if' => 'Alasan penolakan wajib diisi.',
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak valid.',
            'is_allowed_offsite.boolean' => 'Status boleh dibawa keluar harus berupa true/false.',
        ];
    }
}
