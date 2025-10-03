<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumModule extends Model
{
    use HasFactory;
    protected $fillable = ['practicum_id', 'name', 'status'];

    public function practicum()
    {
        return $this->belongsTo(Practicum::class, 'practicum_id');
    }
}
