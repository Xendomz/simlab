import { PracticumSchedulingEquipment } from "@/domain/practicum-scheduling/PracticumSchedulingEquipment";
import { TimeView } from "../time/TimeView";
import { PracticumSchedulingEquipmentType } from "@/domain/practicum-scheduling/PracticumSchedulingEquipmentType";

export class PracticumSchedulingEquipmentView {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly quantity: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly name: string,
        readonly unit: string | null,
        readonly type: PracticumSchedulingEquipmentType
    ){}

    static fromDomain(entity: PracticumSchedulingEquipment): PracticumSchedulingEquipmentView {
        return new PracticumSchedulingEquipmentView (
            entity.id,
            entity.practicumSchedulingId,
            entity.quantity,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.name,
            entity.unit,
            entity.type
        )
    }
}