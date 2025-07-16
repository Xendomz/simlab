<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingApproval extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'role', 'approver_id', 'approved'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
