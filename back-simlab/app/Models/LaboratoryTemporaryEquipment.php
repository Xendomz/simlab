<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryTemporaryEquipment extends Model
{
    use HasFactory;
    protected $fillable = [
        'name'
    ];

    public function practicumSchedulingEquipments()
    {
        return $this->morphMany(PracticumSchedulingEquipment::class, 'equipmentable');
    }
}
