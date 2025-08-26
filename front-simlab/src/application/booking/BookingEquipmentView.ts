import { BookingEquipment } from "@/domain/booking/BookingEquipment";
import { TimeView } from "../time/TimeView";
import { LaboratoryEquipmentView } from "../laboratory-equipment/LaboratoryEquipmentView";

export class BookingEquipmentView {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly laboratoryEquipmentId: number,
        readonly quantity: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly laboratoryEquipment?: LaboratoryEquipmentView
    ) { }

    static fromDomain(entity: BookingEquipment): BookingEquipmentView {
        return new BookingEquipmentView(
            entity.id,
            entity.bookingId,
            entity.laboratoryEquipmentId,
            entity.quantity,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.laboratoryEquipment ? LaboratoryEquipmentView.fromDomain(entity.laboratoryEquipment) : undefined
        )
    }
}