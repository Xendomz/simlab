import { BookingMaterial } from "@/domain/booking/BookingMaterial";

export class BookingMaterialtView {
    constructor(
        readonly id: number,
        readonly quantity: number,
        readonly materialName?: string,
        readonly unit?: string
    ) { }

    static fromDomain(entity: BookingMaterial): BookingMaterialtView {
        return new BookingMaterialtView(
            entity.id,
            entity.quantity,
            entity.getMaterialName(),
            entity.getUnit()
        )
    }
}