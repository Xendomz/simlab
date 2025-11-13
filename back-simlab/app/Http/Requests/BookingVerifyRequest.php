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
        if (!$user || $user->role !== 'laboran') {
            $laboranIdRule = 'required_if:action,approve|' . $laboranIdRule;
        } else {
            // Laboran tidak perlu input laboran_id saat approve
            $laboranIdRule = 'nullable|' . $laboranIdRule;
        }

        $rules = [
            'action' => 'required|in:approve,reject,revision',
            'laboran_id' => $laboranIdRule,
            'information' => 'required_if:action,reject,revision',
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
            && $user && $user->role === 'laboran'
            && $bookingType === 'equipment'
        ) {
            $rules['laboratory_room_id'] = 'required|exists:laboratory_rooms,id';
            $rules['is_allowed_offsite'] = 'nullable|boolean';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'action.required' => 'Aksi verifikasi wajib dipilih.',
            'action.in' => 'Aksi verifikasi tidak valid.',
            'laboran_id.required_if' => 'Pilih laboran terlebih dahulu untuk melakukan persetujuan.',
            'laboran_id.exists' => 'Laboran yang dipilih tidak ditemukan.',
            'laboran_id.nullable' => 'Laboran boleh dikosongkan.',
            'information.required_if' => 'Alasan penolakan atau revisi wajib diisi.',
            'information.filled' => 'Alasan wajib diisi.',
            'laboratory_room_id.required' => 'Ruangan laboratorium wajib dipilih.',
            'laboratory_room_id.exists' => 'Ruangan laboratorium tidak valid.',
            'is_allowed_offsite.boolean' => 'Status boleh dibawa keluar harus berupa true/false.',
        ];
    }
}
