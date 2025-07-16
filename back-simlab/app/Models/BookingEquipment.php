<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingEquipment extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'alat_laboratorium_id', 'quantity'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function laboratoryEquipment()
    {
        return $this->belongsTo(AlatLaboratorium::class, 'alat_laboratorium_id');
    }
}
