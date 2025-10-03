<?php

namespace App\Models;

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

    public function practicumClass()
    {
        return $this->belongsTo(PracticumClass::class, 'practicum_class_id');
    }

    public function practicumModule()
    {
        return $this->belongsTo(PracticumModule::class, 'practicum_module_id');
    }
}
