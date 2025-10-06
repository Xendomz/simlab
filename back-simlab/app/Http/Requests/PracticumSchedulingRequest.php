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
            'practicum_id' => 'required|exists:practicums,id',
            'phone_number' => 'required|max:15',
            'classes' => 'required|array|min:1',
            'classes.*.lecturer_id' => 'required|exists:users,id',
            'classes.*.laboratory_room_id' => 'required|exists:laboratory_rooms,id',
            'classes.*.name' => 'required|string',
            'classes.*.practicum_assistant' => 'required|string',
            'classes.*.total_participant' => 'required|integer|min:1',
            'classes.*.total_group' => 'required|integer|min:1',
            'classes.*.sessions' => 'required|array|min:1',
            'classes.*.sessions.*.practicum_module_id' => 'required|exists:practicum_modules,id',
            'classes.*.sessions.*.start_time' => 'required|date',
            'classes.*.sessions.*.end_time' => 'required|date|after_or_equal:classes.*.sessions.*.start_time',
        ];
    }

    public function messages()
    {
        return [
            'practicum_id.required' => 'Praktikum wajib diisi.',
            'practicum_id.exists' => 'Praktikum tidak ditemukan.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.max' => 'Nomor telepon maksimal 15 karakter.',
            'classes.required' => 'Minimal satu kelas harus diisi.',
            'classes.array' => 'Format kelas tidak valid.',
            'classes.min' => 'Minimal satu kelas harus diisi.',
            'classes.*.lecturer_id.required' => 'Dosen pengampu wajib diisi.',
            'classes.*.lecturer_id.exists' => 'Dosen pengampu tidak ditemukan.',
            'classes.*.laboratory_room_id.required' => 'Ruangan laboratorium wajib diisi.',
            'classes.*.laboratory_room_id.exists' => 'Ruangan laboratorium tidak ditemukan.',
            'classes.*.name.required' => 'Nama kelas wajib diisi.',
            'classes.*.practicum_assistant.required' => 'Asisten praktikum wajib diisi.',
            'classes.*.total_participant.required' => 'Jumlah peserta wajib diisi.',
            'classes.*.total_participant.integer' => 'Jumlah peserta harus berupa angka.',
            'classes.*.total_participant.min' => 'Jumlah peserta minimal 1 orang.',
            'classes.*.total_group.required' => 'Jumlah kelompok wajib diisi.',
            'classes.*.total_group.integer' => 'Jumlah kelompok harus berupa angka.',
            'classes.*.total_group.min' => 'Jumlah kelompok minimal 1.',
            'classes.*.sessions.required' => 'Minimal satu sesi harus diisi.',
            'classes.*.sessions.array' => 'Format sesi tidak valid.',
            'classes.*.sessions.min' => 'Minimal satu sesi harus diisi.',
            'classes.*.sessions.*.practicum_module_id.required' => 'Modul praktikum wajib diisi.',
            'classes.*.sessions.*.practicum_module_id.exists' => 'Modul praktikum tidak ditemukan.',
            'classes.*.sessions.*.start_time.required' => 'Waktu mulai sesi wajib diisi.',
            'classes.*.sessions.*.start_time.date' => 'Waktu mulai sesi harus berupa tanggal yang valid.',
            'classes.*.sessions.*.end_time.required' => 'Waktu selesai sesi wajib diisi.',
            'classes.*.sessions.*.end_time.date' => 'Waktu selesai sesi harus berupa tanggal yang valid.',
            'classes.*.sessions.*.end_time.after_or_equal' => 'Waktu selesai sesi harus setelah atau sama dengan waktu mulai.',
        ];
    }
}
