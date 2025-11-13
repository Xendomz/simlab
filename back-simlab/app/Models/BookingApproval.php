<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingApproval extends Model
{
    use HasFactory;

    // Always return created_at in WITA timezone as ISO 8601 string
    public function getCreatedAtAttribute($value)
    {
        return $this->asDateTime($value)
            ->setTimezone('Asia/Makassar')
            ->toIso8601String();
    }

    protected $fillable = ['booking_id', 'action', 'approver_id', 'is_approved', 'information'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected function serializeDate(\DateTimeInterface $date): string
    {
        // Convert stored (likely UTC) datetime into application timezone for output
        return Carbon::instance($date)->setTimezone(config('app.timezone'))
            ->format(\DateTimeInterface::ATOM); // Y-m-d\TH:i:sP
    }

    public function getApprovalStatusLabelAttribute()
    {
        switch ($this->is_approved) {
            case 0:
                return 'rejected';
            case 1:
                return 'approved';
            case 2:
                return 'revision';
            default:
                return 'pending';
        }
    }

    protected static function actionDefinition(): array
    {
        return [
            'request_booking' => [
                'role' => 'pemohon',
                'description' => 'Pemohon mengajukan peminjaman',
            ],
            'verified_by_head' => [
                'role' => 'kepala_lab_terpadu',
                'description' => 'Melakukan verifikasi terhadap peminjaman',
            ],
            'verified_by_laboran' => [
                'role' => 'laboran',
                'description' => 'Menerima tugas dari Kepala Laboratorium Terpadu dan selanjutnya melakukan pengecekkan terhadap peminjaman.',
            ],
            'returned_by_requestor' => [
                'role' => 'pemohon',
                'description' => 'Mahasiswa melakukan verifikasi pengembalian alat',
            ],
            'return_confirmed_by_laboran' => [
                'role' => 'laboran',
                'description' => 'Laboran memverifikasi pengembalian alat',
            ],
        ];
    }

    private static function approvalFlows(): array
    {
        return [
            'room' => [
                'request_booking',
                'verified_by_head',
                'verified_by_laboran',
            ],
            'room_n_equipment' => [
                'request_booking',
                'verified_by_head',
                'verified_by_laboran',
            ],
            'equipment' => [
                'request_booking',
                'verified_by_head',
                'verified_by_laboran',
                'returned_by_requestor',
                'return_confirmed_by_laboran'
            ]
        ];
    }

    public static function getFlow($type): array
    {
        $flows = self::approvalFlows();
        $definition = self::actionDefinition();

        return collect($flows[$type])->map(fn($action) => [
            'action' => $action,
            'role' => $definition[$action]['role'],
            'description' => $definition[$action]['description']
        ])->toArray();
    }
}
