<?php
namespace App\Models;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingApproval extends Model
{
    use HasFactory;

    // Always return created_at in WITA timezone as ISO 8601 string
    public function getCreatedAtAttribute($value)
    {
        return $this->asDateTime($value)
            ->setTimezone('Asia/Makassar')
            ->toIso8601String();
    }

    protected $fillable = ['booking_id', 'role', 'approver_id', 'is_approved', 'information'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }
}
