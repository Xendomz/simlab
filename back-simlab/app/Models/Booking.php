<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = ['academic_year_id', 'user_id', 'phone_number', 'purpose', 'supporting_file', 'supervisor', 'supervisor_email', 'start_time', 'end_time', 'status', 'booking_type'];

    public function academicYear()
    {
        return $this->belongsTo(TahunAkademik::class, 'academic_year_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room()
    {
        return $this->hasOne(BookingRoom::class, 'booking_id');
    }

    public function equipments()
    {
        return $this->hasMany(BookingEquipment::class, 'booking_id');
    }

    public function materials()
    {
        return $this->hasMany(BookingMaterial::class, 'booking_id');
    }

    public function approvals()
    {
        return $this->hasMany(BookingApproval::class, 'booking_id');
    }
}
