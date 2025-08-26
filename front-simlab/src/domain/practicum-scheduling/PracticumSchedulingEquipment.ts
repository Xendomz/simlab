import { LaboratoryEquipment } from "../laboratory-equipment/LaboratoryEquipment";
import { Time } from "../time/Time";

export class PracticumSchedulingEquipment {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly laboartoryEquipmentId: number,
        readonly quantity: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly laboratoryEquipment?: LaboratoryEquipment
    ){}
}