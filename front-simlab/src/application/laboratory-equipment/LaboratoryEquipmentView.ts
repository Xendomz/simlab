import { LaboratoryEquipment } from "@/domain/laboratory-equipment/LaboratoryEquipment";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";
import { MoneyView } from "../money/MoneyView";

export class LaboratoryEquipmentView {
    private constructor(
        readonly id: number,
        readonly equipmentName: string,
        readonly quantity: number,
        readonly unit: string,
        readonly equipmentFunction: string,
        readonly photo: string,
        readonly brand: string,
        readonly equipmentType: string,
        readonly origin: string,
        readonly condition: string,
        readonly conditionDescription: string,
        readonly assetCode: string,
        readonly studentPrice: MoneyView,
        readonly lecturerPrice: MoneyView,
        readonly externalPrice: MoneyView,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly laboratoryRoom?: LaboratoryRoomView
    ){}

    static fromDomain(entity: LaboratoryEquipment): LaboratoryEquipmentView {
        return new LaboratoryEquipmentView(
            entity.id,
            entity.equipmentName,
            entity.quantity,
            entity.unit,
            entity.equipmentFunction,
            entity.photo,
            entity.brand,
            entity.equipmentType,
            entity.origin,
            entity.condition,
            entity.conditionDescription,
            entity.assetCode,
            MoneyView.toViewModel(entity.studentPrice),
            MoneyView.toViewModel(entity.lecturerPrice),
            MoneyView.toViewModel(entity.externalPrice),
            entity.createdAt,
            entity.updatedAt,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined
        )
    }
}