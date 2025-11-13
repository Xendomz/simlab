import { LaboratoryMaterial } from "@/domain/laboratory-material/LaboratoryMaterial";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";
import { MoneyView } from "../money/MoneyView";

export class LaboratoryMaterialView {
    private constructor(
        readonly id: number,
        readonly code: string,
        readonly materialName: string,
        readonly brand: string,
        readonly stock: number,
        readonly unit: string,
        readonly purchaseDate: Date,
        readonly expiryDate: Date,
        readonly description: string,
        readonly refillDate: Date,
        readonly studentPrice: MoneyView,
        readonly lecturerPrice: MoneyView,
        readonly externalPrice: MoneyView,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly laboratoryRoom?: LaboratoryRoomView
    ) { }

    static fromDomain(entity: LaboratoryMaterial): LaboratoryMaterialView {
        return new LaboratoryMaterialView(
            entity.id,
            entity.code,
            entity.materialName,
            entity.brand,
            entity.stock,
            entity.unit,
            entity.purchaseDate,
            entity.expiryDate,
            entity.description,
            entity.refillDate,
            MoneyView.toViewModel(entity.studentPrice),
            MoneyView.toViewModel(entity.lecturerPrice),
            MoneyView.toViewModel(entity.externalPrice),
            entity.createdAt,
            entity.updatedAt,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined
        )
    }
}