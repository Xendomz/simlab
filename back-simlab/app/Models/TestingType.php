<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingType extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'unit', 'student_price', 'lecturer_price', 'external_price'];
}
