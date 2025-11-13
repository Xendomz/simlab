import { BookingEquipment } from "@/domain/booking/BookingEquipment";

export class BookingEquipmentView {
    constructor(
        readonly id: number,
        readonly quantity: number,
        readonly equipmentName?: string,
        readonly unit?: string
    ) { }

    static fromDomain(entity: BookingEquipment): BookingEquipmentView {
        return new BookingEquipmentView(
            entity.id,
            entity.quantity,
            entity.getEquipmentName(),
            entity.getUnit()
        )
    }
}