<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingRoom extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'ruangan_laboratorium_id', 'total_participant', 'participant_list'];

    public function laboartoryRoom()
    {
        return $this->belongsTo(RuanganLaboratorium::class, 'ruangan_laboratorium_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
