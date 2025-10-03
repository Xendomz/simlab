<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'laboratory_room_id',
        'material_name',
        'brand',
        'stock',
        'unit',
        'purchase_date',
        'expiry_date',
        'description',
        'refill_date',
        'student_price',
        'lecturer_price',
        'external_price'
    ];

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
    }
}
