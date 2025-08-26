import { LaboratoryMaterialView } from "../laboratory-material/LaboratoryMaterialView";
import { TimeView } from "../time/TimeView";
import { BookingMaterial } from "@/domain/booking/BookingMaterial";

export class BookingMaterialtView {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly laboratoryMaterialId: number,
        readonly quantity: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly laboratoryMaterial?: LaboratoryMaterialView
    ) { }

    static fromDomain(entity: BookingMaterial): BookingMaterialtView {
        return new BookingMaterialtView(
            entity.id,
            entity.bookingId,
            entity.laboratoryMaterialId,
            entity.quantity,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.laboratoryMaterial ? LaboratoryMaterialView.fromDomain(entity.laboratoryMaterial) : undefined
        )
    }
}