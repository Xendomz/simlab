<?php

namespace App\Models;

use DateTimeInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = ['academic_year_id', 'user_id', 'phone_number', 'purpose', 'supporting_file', 'activity_name', 'supervisor', 'supervisor_email', 'start_time', 'end_time', 'status', 'booking_type', 'total_participant', 'participant_list', 'laboratory_room_id', 'laboran_id'];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
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

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function getKepalaLabApprovalStatusAttribute() {
        return $this->approvals()
            ->where('role', 'Kepala Lab Terpadu')
            ->exists();
    }

    public function getKepalaLabApprovalAttribute() {
        $approval = $this->approvals()
            ->where('role', 'Kepala Lab Terpadu')
            ->first();
        return $approval ?: null;
    }

    public function getLaboranApprovalAttribute() {
        $approval = $this->approvals()
            ->where('role', 'Laboran')
            ->first();
        return $approval ?: null;
    }

    public function getLaboranOffsiteApprovedAttribute()
    {
        return $this->approvals()
            ->where('role', 'Laboran')
            ->where('approved', 1)
            ->where('is_allowed_offsite', 1)
            ->exists();
    }
}
