<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSchedulingEquipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'alat_laboratorium_id',
        'quantity',
    ];

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function laboratoryEquipment() {
        return $this->belongsTo(AlatLaboratorium::class, 'alat_laboratorium_id');
    }
}
