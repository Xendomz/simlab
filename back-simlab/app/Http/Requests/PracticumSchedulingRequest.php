<?php

namespace App\Http\Requests;

class PracticumSchedulingRequest extends ApiRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'praktikum_id' => 'required|exists:praktikums,id',
            'ruangan_laboratorium_id' => 'required|exists:ruangan_laboratoria,id',
            'phone_number' => 'required|max:15',
            'groups' => 'required|array|min:1',
            'groups.*.group_name' => 'required|string',
            'groups.*.practicum_assistant' => 'required|string',
            'groups.*.practicum_session' => 'required|string',
            'groups.*.start_time' => 'required|date',
            'groups.*.end_time' => 'required|date|after_or_equal:groups.*.start_time',
            'groups.*.total_participant' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'praktikum_id.required' => 'Practicum wajib diisi.',
            'praktikum_id.exists' => 'Praktikum tidak ditemukan.',
            'ruangan_laboratorium_id.required' => 'Ruangan laboratorium wajib diisi.',
            'ruangan_laboratorium_id.exists' => 'Ruangan laboratorium tidak ditemukan.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon maksimal 15 karakter.',
            'groups.required' => 'Minimal satu kelompok harus diisi.',
            'groups.array' => 'Format kelompok tidak valid.',
            'groups.min' => 'Minimal satu kelompok harus diisi.',
            'groups.*.group_name.required' => 'Nama kelompok wajib diisi.',
            'groups.*.practicum_assistant.required' => 'Asisten praktikum wajib diisi.',
            'groups.*.practicum_session.required' => 'Sesi praktikum wajib diisi.',
            'groups.*.start_time.required' => 'Waktu mulai kelompok wajib diisi.',
            'groups.*.start_time.date' => 'Waktu mulai kelompok harus berupa tanggal yang valid.',
            'groups.*.end_time.required' => 'Waktu selesai kelompok wajib diisi.',
            'groups.*.end_time.date' => 'Waktu selesai kelompok harus berupa tanggal yang valid.',
            'groups.*.end_time.after_or_equal' => 'Waktu selesai kelompok harus setelah atau sama dengan waktu mulai.',
            'groups.*.total_participant.required' => 'Jumlah peserta wajib diisi.',
            'groups.*.total_participant.integer' => 'Jumlah peserta harus berupa angka.',
            'groups.*.total_participant.min' => 'Jumlah peserta minimal 1 orang.',
        ];
    }
}
