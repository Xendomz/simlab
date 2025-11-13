<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingMaterialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'material_name' => $this->whenLoaded('laboratoryMaterial', function () {
                return $this->laboratoryMaterial->material_name;
            }),
            'unit' => $this->whenLoaded('laboratoryMaterial', function () {
                return $this->laboratoryMaterial->unit;
            }),
            'quantity' => $this->quantity
        ];
    }
}
