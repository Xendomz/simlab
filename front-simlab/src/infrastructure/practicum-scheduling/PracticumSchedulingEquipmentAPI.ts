import { PracticumSchedulingEquipment } from "@/domain/practicum-scheduling/PracticumSchedulingEquipment";
import { LaboratoryEquipmentAPI, toDomain as toLaboratoryEquipment } from "../laboratory-equipment/LaboratoryEquipmentAPI";
import { Time } from "@/domain/time/Time";

export type PracticumSchedulingEquipmentAPI = {
    id: number;
    practicum_scheduling_id: number;
    alat_laboratorium_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    laboratory_equipment?: LaboratoryEquipmentAPI
}

export function toDomain(api: PracticumSchedulingEquipmentAPI): PracticumSchedulingEquipment {
    return new PracticumSchedulingEquipment(
        api.id,
        api.practicum_scheduling_id,
        api.alat_laboratorium_id,
        api.quantity,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.laboratory_equipment ? toLaboratoryEquipment(api.laboratory_equipment) : undefined
    )
}