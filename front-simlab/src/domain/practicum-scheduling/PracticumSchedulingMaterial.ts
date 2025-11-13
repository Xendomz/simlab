import { LaboratoryMaterial } from "../laboratory-material/LaboratoryMaterial";
import { Time } from "../time/Time";

export class PracticumSchedulingMaterial {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly laboratoryMaterialId: number,
        readonly quantity: number,
        readonly realization: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly laboratoryMaterial?: LaboratoryMaterial
    ){}
}