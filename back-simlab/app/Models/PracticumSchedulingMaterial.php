<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSchedulingMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'bahan_laboratorium_id',
        'quantity',
    ];

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function laboratoryMaterial() {
        return $this->belongsTo(BahanLaboratorium::class, 'bahan_laboratorium_id');
    }
}
