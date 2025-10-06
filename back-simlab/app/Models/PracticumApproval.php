<?php

namespace App\Models;

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

    public function practicumScheduling() {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }

    public function approver() {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
