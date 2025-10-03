<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;
    protected $fillable = ['code', 'name'];

    public function majors()
    {
        return $this->hasMany(Major::class, 'faculty_id');
    }
}
