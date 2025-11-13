import { BookingEquipment } from "@/domain/booking/BookingEquipment";

export type BookingEquipmentAPI = {
    id: number;
    quantity: number;
    equipment_name: string,
    unit: string
}

export function toDomain(api: BookingEquipmentAPI): BookingEquipment {
    const bookingEquipment = new BookingEquipment(
        api.id,
        api.quantity,
    )

    if (api.equipment_name) {
        bookingEquipment.setEquipmentName(api.equipment_name)
    }

    if (api.unit) {
        bookingEquipment.setUnit(api.unit)
    }

    return bookingEquipment
}