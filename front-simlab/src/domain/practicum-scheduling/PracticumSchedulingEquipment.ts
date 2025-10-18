import { Time } from "../time/Time";
import { PracticumSchedulingEquipmentType } from "./PracticumSchedulingEquipmentType";

export class PracticumSchedulingEquipment {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly quantity: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly name: string,
        readonly unit: string | null,
        readonly type: PracticumSchedulingEquipmentType
    ){}
}