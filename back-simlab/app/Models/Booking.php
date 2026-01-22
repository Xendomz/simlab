<?php

namespace App\Models;

use DateTimeInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = ['academic_year_id', 'user_id', 'phone_number', 'purpose', 'supporting_file', 'activity_name', 'supervisor', 'supervisor_email', 'start_time', 'end_time', 'status', 'booking_type', 'total_participant', 'participant_list', 'laboratory_room_id', 'laboran_id', 'is_allowed_offsite'];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboran()
    {
        return $this->belongsTo(User::class, 'laboran_id');
    }

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
    }

    public function equipments()
    {
        return $this->hasMany(BookingEquipment::class, 'booking_id');
    }

    public function materials()
    {
        return $this->hasMany(BookingMaterial::class, 'booking_id');
    }

    public function approvals()
    {
        return $this->hasMany(BookingApproval::class, 'booking_id');
    }

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function setStartTimeAttribute($value)
    {
        $this->attributes['start_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    public function setEndTimeAttribute($value)
    {
        $this->attributes['end_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function getKepalaLabApprovalAttribute()
    {
        $approval = $this->approvals()
            ->where('action', 'verified_by_head')
            ->first();
        return $approval ?: null;
    }

    public function getLaboranApprovalAttribute()
    {
        $approval = $this->approvals()
            ->where('action', 'verified_by_laboran')
            ->first();
        return $approval ?: null;
    }

    public function getIsRequestorCanReturnAttribute(): bool
    {
        if ($this->status !== 'approved') {
            return false;
        }

        // Return true only if there is NO approved 'return_by_requestor' record
        $hasApprovedReturn = $this->approvals()
            ->where('action', 'return_by_requestor')
            ->where('is_approved', true)
            ->exists();

        return !$hasApprovedReturn;
    }

    public function getLaboranOffsiteApprovedAttribute()
    {
        return $this->approvals()
            ->where('role', 'laboran')
            ->where('approved', 1)
            ->where('is_allowed_offsite', 1)
            ->exists();
    }

    public function getApprovalStepsAttribute()
    {
        $approvals = [];
        $allApproved = true;
        $hasBeenRejected = false;

        // Pastikan booking_type tersedia
        if (!$this->booking_type) {
            return [];
        }

        $approvalFlows = BookingApproval::getFlow($this->booking_type);

        foreach ($approvalFlows as $flow) {
            $approval = $this->approvals
                ->where('action', $flow['action'])
                ->sortByDesc('created_at')
                ->first();

            if ($approval) {
                if (!$approval->is_approved) {
                    $hasBeenRejected = true;
                }
                $status = $approval->approval_status_label;
            } else {
                $status = $hasBeenRejected ? 'rejected' : 'pending';
            }

            $approvals[] = [
                'action' => $flow['action'],
                'description' => $flow['description'],
                'role' => $flow['role'],
                'status' => $status,
                'information' => $approval?->information,
                'approved_at' => $approval?->created_at
                    ? Carbon::parse($approval->created_at)
                    ->setTimezone(config('app.timezone'))
                    ->toIso8601String()
                    : null,
                'approver' => $approval?->approver?->name,
            ];

            if ($status !== 'approved') {
                $allApproved = false;
            }
        }

        // Add finish step
        $approvals[] = [
            'action' => 'finish',
            'description' => '',
            'role' => 'selesai',
            'status' => $allApproved ? 'approved' : ($hasBeenRejected ? 'rejected' : 'pending'),
            'information' => null,
            'approved_at' => null,
            'approver' => null,
        ];

        return $approvals;
    }
}
