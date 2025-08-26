import { PracticumSchedulingEquipment } from "@/domain/practicum-scheduling/PracticumSchedulingEquipment";
import { LaboratoryEquipmentView } from "../laboratory-equipment/LaboratoryEquipmentView";
import { TimeView } from "../time/TimeView";

export class PracticumSchedulingEquipmentView {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly laboratoryEquipmentId: number,
        readonly quantity: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly laboratoryEquipment?: LaboratoryEquipmentView
    ){}

    static fromDomain(entity: PracticumSchedulingEquipment): PracticumSchedulingEquipmentView {
        return new PracticumSchedulingEquipmentView (
            entity.id,
            entity.practicumSchedulingId,
            entity.laboartoryEquipmentId,
            entity.quantity,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.laboratoryEquipment ? LaboratoryEquipmentView.fromDomain(entity.laboratoryEquipment) : undefined
        )
    }
}