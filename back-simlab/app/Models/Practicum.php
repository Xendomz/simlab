<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Practicum extends Model
{
    use HasFactory;
    protected $fillable = ['code', 'name', 'study_program_id', 'sks'];

    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class, 'study_program_id');
    }

    public function practicumModules()
    {
        return $this->hasMany(PracticumModule::class, 'practicum_id');
    }
}
