import { PracticumSchedulingMaterial } from "@/domain/practicum-scheduling/PracticumSchedulingMaterial";
import { LaboratoryMaterialAPI, toDomain as toLaboratoryMaterial } from "../laboratory-material/LaboratoryMaterialAPI";
import { Time } from "@/domain/time/Time";

export type PracticumSchedulingMaterialAPI = {
    id: number;
    practicum_scheduling_id: number;
    bahan_laboratorium_id: number;
    quantity: number;
    realization: number;
    created_at: string;
    updated_at: string;
    laboratory_material?: LaboratoryMaterialAPI
}

export function toDomain(api: PracticumSchedulingMaterialAPI): PracticumSchedulingMaterial {
    return new PracticumSchedulingMaterial(
        api.id,
        api.practicum_scheduling_id,
        api.bahan_laboratorium_id,
        api.quantity,
        api.realization,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.laboratory_material ? toLaboratoryMaterial(api.laboratory_material) : undefined
    )
}