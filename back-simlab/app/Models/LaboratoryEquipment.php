<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryEquipment extends Model
{
    use HasFactory;

    protected $table = 'laboratory_equipments';
    protected $fillable = [
        'laboratory_room_id',
        'equipment_name',
        'quantity',
        'unit',
        'function',
        'photo',
        'brand',
        'equipment_type',
        'origin',
        'condition',
        'condition_description',
        'asset_code',
        'student_price',
        'lecturer_price',
        'external_price'
    ];

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
    }

    public function practicumSchedulingEquipments()
    {
        return $this->morphMany(PracticumSchedulingEquipment::class, 'equipmentable');
    }
}
