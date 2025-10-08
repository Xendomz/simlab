<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'approver_id',
        'role',
        'is_approved',
        'information',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function approver() {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
