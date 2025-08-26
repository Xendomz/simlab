<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingMaterial extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'bahan_laboratorium_id', 'quantity'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function laboratoryMaterial()
    {
        return $this->belongsTo(BahanLaboratorium::class, 'bahan_laboratorium_id');
    }
}
