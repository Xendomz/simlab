<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyProgram extends Model
{
    use HasFactory;

    protected $fillable = ['major_id', 'name'];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function practicums()
    {
        return $this->hasMany(Practicum::class, 'study_program_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'study_program_id');
    }
}
