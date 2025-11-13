import { BookingMaterial } from "@/domain/booking/BookingMaterial";

export type BookingMaterialAPI = {
    id: number;
    quantity: number;
    material_name: string
    unit: string
}

export function toDomain(api: BookingMaterialAPI): BookingMaterial {
    const bookingMaterial = new BookingMaterial(
        api.id,
        api.quantity,
    )

    if (api.material_name) {
        bookingMaterial.setMaterialName(api.material_name)
    }

    if (api.unit) {
        bookingMaterial.setUnit(api.unit)
    }

    return bookingMaterial
}