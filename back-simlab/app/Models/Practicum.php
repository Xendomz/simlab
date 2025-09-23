<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Practicum extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'study_program_id', 'sks'];

    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class, 'study_program_id');
    }
}
