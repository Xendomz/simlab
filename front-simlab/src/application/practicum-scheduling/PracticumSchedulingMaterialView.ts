import { PracticumSchedulingMaterial } from "@/domain/practicum-scheduling/PracticumSchedulingMaterial";
import { LaboratoryMaterialView } from "../laboratory-material/LaboratoryMaterialView";
import { TimeView } from "../time/TimeView";

export class PracticumSchedulingMaterialView {
    constructor(
        readonly id: number,
        readonly practicumSchedulingId: number,
        readonly laboratoryMaterialId: number,
        readonly quantity: number,
        readonly realization: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly laboratoryMaterial?: LaboratoryMaterialView
    ) { }

    static fromDomain(entity: PracticumSchedulingMaterial): PracticumSchedulingMaterialView {
        return new PracticumSchedulingMaterialView(
            entity.id,
            entity.practicumSchedulingId,
            entity.laboratoryMaterialId,
            entity.quantity,
            entity.realization,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.laboratoryMaterial ? LaboratoryMaterialView.fromDomain(entity.laboratoryMaterial) : undefined
        )
    }
}