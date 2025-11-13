<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumScheduling extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'user_id',
        'laboran_id',
        'practicum_id',
        'phone_number',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function practicum() {
        return $this->belongsTo(Practicum::class, 'practicum_id');
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboran() {
        return $this->belongsTo(User::class, 'laboran_id');
    }

    public function practicumClasses() {
        return $this->hasMany(PracticumClass::class, 'practicum_scheduling_id');
    }

    public function practicumSchedulingEquipments() {
        return $this->hasMany(PracticumSchedulingEquipment::class, 'practicum_scheduling_id');
    }

    public function practicumSchedulingMaterials() {
        return $this->hasMany(PracticumSchedulingMaterial::class, 'practicum_scheduling_id');
    }

    public function practicumApprovals() {
        return $this->hasMany(PracticumApproval::class, 'practicum_scheduling_id');
    }

    public function getTotalGroupsAttribute()
    {
        // If the relationship is already loaded, sum in-memory to avoid an extra query
        if ($this->relationLoaded('practicumClasses')) {
            return (int) $this->practicumClasses->sum('total_group');
        }

        // Otherwise perform a SQL SUM which is efficient for large datasets
        return (int) $this->practicumClasses()->sum('total_group');
    }

    public function getKepalaLabApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'kepala_lab_terpadu')
            ->first();

        return $approval;
    }

    public function getLaboranApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'laboran')
            ->first();
        return $approval ?: null;
    }
}
