<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'floor',
        'user_id',
        'student_price',
        'lecturer_price',
        'external_price'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function alatLaboratorium()
    {
        return $this->hasMany(LaboratoryEquipment::class, 'laboratory_room_id');
    }

    public function bahanLaboratorium()
    {
        return $this->hasMany(LaboratoryMaterial::class, 'laboratory_material_id');
    }
}
