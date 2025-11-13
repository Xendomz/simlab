<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingEquipmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'equipment_name' => $this->whenLoaded('laboratoryEquipment', function () {
                return $this->laboratoryEquipment->equipment_name;
            }),
            'unit' => $this->whenLoaded('laboratoryEquipment', function () {
                return $this->laboratoryEquipment->unit;
            }),
            'quantity' => $this->quantity
        ];
    }
}
