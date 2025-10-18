<?php

namespace App\Http\Resources\PracticumScheduling;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticumSchedulingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        $data['practicum_scheduling_equipments'] = $this->whenLoaded('practicumSchedulingEquipments', function () {
            return $this->practicumSchedulingEquipments->map(function ($equipment) {
                $practicumEquipment = [
                    'id' => $equipment->id,
                    'practicum_scheduling_id' => $equipment->practicum_scheduling_id,
                    'quantity' => $equipment->quantity,
                    'created_at' => optional($equipment->created_at)->toIso8601String(),
                    'updated_at' => optional($equipment->updated_at)->toIso8601String(),
                ];

                if ($equipment->relationLoaded('equipmentable') && $equipment->equipmentable) {
                    $type = class_basename($equipment->equipmentable_type);

                    switch ($type) {
                        case 'LaboratoryEquipment':
                            $practicumEquipment['name'] = $equipment->equipmentable->equipment_name;
                            $practicumEquipment['unit'] = $equipment->equipmentable->unit ?? null;
                            $practicumEquipment['type'] = 'laboratory_equipment';
                            break;

                        case 'LaboratoryTemporaryEquipment':
                            $practicumEquipment['name'] = $equipment->equipmentable->name;
                            $practicumEquipment['unit'] = null;
                            $practicumEquipment['type'] = 'laboratory_temporary_equipment';
                            break;
                    }
                }

                return $practicumEquipment;
            });
        });

        return $data;
    }
}
