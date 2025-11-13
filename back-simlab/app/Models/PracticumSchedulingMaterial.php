<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSchedulingMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'laboratory_material_id',
        'quantity',
        'realization'
    ];

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function laboratoryMaterial() {
        return $this->belongsTo(LaboratoryMaterial::class, 'laboratory_material_id');
    }
}
