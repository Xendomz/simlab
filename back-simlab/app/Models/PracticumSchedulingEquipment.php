<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSchedulingEquipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'quantity',
        'equipmentable_id',
        'equipmentable_type',
    ];

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function equipmentable()
    {
        return $this->morphTo();
    }
}
