<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'lecturer_id',
        'laboratory_room_id',
        'name',
        'practicum_assistant',
        'total_participant',
        'total_group',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
    }

    public function practicumScheduling()
    {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function practicumSessions()
    {
        return $this->hasMany(PracticumSession::class, 'practicum_class_id');
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}
