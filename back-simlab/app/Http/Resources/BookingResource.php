<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    protected static $approvals = false;
    protected static $isRequestor = false;

    public static function collectionWithApprovals($resource)
    {
        static::$approvals = true;
        return parent::collection($resource);
    }

    public static function collectionRequestor($resource)
    {
        static::$isRequestor = true;
        return parent::collection($resource);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'academic_year' => $this->whenLoaded('academicYear', function () {
                return $this->academicYear->name;
            }),
            'requestor' => $this->whenLoaded('user', function () {
                return [
                    'name' => $this->user->name,
                    'email' => $this->user->email
                ];
            }),
            'laboran' => $this->whenLoaded('laboran', function () {
                return [
                    'name' => $this->laboran->name,
                    'email' => $this->laboran->email
                ];
            }),
            'laboratory_room_name' => $this->whenLoaded('laboratoryRoom', function () {
                return $this->laboratoryRoom->name;
            }),
            'phone_number' => $this->phone_number,
            'purpose' => $this->purpose,
            'supporting_file' => $this->supporting_file,
            'activity_name' => $this->activity_name,
            'supervisor' => $this->supervisor,
            'supervisor_email' => $this->supervisor_email,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'booking_type' => $this->booking_type,
            'total_participant' => $this->total_participant,
            'participant_list' => $this->participant_list,
            'is_allowed_offsite' => (bool) $this->is_allowed_offsite,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            $this->mergeWhen(static::$approvals, function () {
                return ['approvals' => $this->approval_steps];
            }),

            $this->mergeWhen(static::$isRequestor && $this->booking_type === 'equipment', function () {
                return ['is_requestor_can_return' => $this->is_requestor_can_return];
            }),

            // relasi nested
            'booking_equipments' => BookingEquipmentResource::collection($this->whenLoaded('equipments')),
            'booking_materials' => BookingMaterialResource::collection($this->whenLoaded('materials')),
        ];
    }
}
