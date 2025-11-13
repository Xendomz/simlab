<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingEquipment extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'laboratory_equipment_id', 'quantity'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function laboratoryEquipment()
    {
        return $this->belongsTo(LaboratoryEquipment::class, 'laboratory_equipment_id');
    }
}
