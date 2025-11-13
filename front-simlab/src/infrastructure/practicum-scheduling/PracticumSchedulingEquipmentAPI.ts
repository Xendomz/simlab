import { PracticumSchedulingEquipment } from "@/domain/practicum-scheduling/PracticumSchedulingEquipment";
import { Time } from "@/domain/time/Time";
import { PracticumSchedulingEquipmentType } from "@/domain/practicum-scheduling/PracticumSchedulingEquipmentType";

export type PracticumSchedulingEquipmentAPI = {
    id: number;
    practicum_scheduling_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    name: string;
    unit: string | null;
    type: string
}

export function toDomain(api: PracticumSchedulingEquipmentAPI): PracticumSchedulingEquipment {
    return new PracticumSchedulingEquipment(
        api.id,
        api.practicum_scheduling_id,
        api.quantity,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.name,
        api.unit,
        api.type as PracticumSchedulingEquipmentType
    )
}