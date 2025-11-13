<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSession extends Model
{
    use HasFactory;
    protected $fillable = [
        'practicum_class_id',
        'practicum_module_id',
        'start_time',
        'end_time',
        'is_class_conducted',
        'laboran_comment',
        'laboran_commented_at',
        'lecturer_comment',
        'lecturer_commented_at'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'laboran_commented_at' => 'datetime',
        'lecturer_commented_at' => 'datetime'
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function practicumClass()
    {
        return $this->belongsTo(PracticumClass::class, 'practicum_class_id');
    }

    public function practicumModule()
    {
        return $this->belongsTo(PracticumModule::class, 'practicum_module_id');
    }
}
