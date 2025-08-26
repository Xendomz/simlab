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
        'ruangan_laboratorium_id',
        'laboran_id',
        'praktikum_id',
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
        return $this->belongsTo(Praktikum::class, 'praktikum_id');
    }

    public function academicYear() {
        return $this->belongsTo(TahunAkademik::class, 'academic_year_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboratoryRoom() {
        return $this->belongsTo(RuanganLaboratorium::class, 'ruangan_laboratorium_id');
    }

    public function practicumGroups() {
        return $this->hasMany(PracticumGroup::class, 'practicum_scheduling_id');
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

    public function getKooprodiApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'Koorprodi')
            ->first();
        return $approval ?: null;
    }

    public function getKepalaLabApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'Kepala Lab Terpadu')
            ->first();
        return $approval ?: null;
    }

    public function getLaboranApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'Laboran')
            ->first();
        return $approval ?: null;
    }
}
