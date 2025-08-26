import { BookingMaterial } from "@/domain/booking/BookingMaterial";
import { Time } from "@/domain/time/Time";
import { LaboratoryMaterialAPI, toDomain as toLaboratoryMaterial } from "../laboratory-material/LaboratoryMaterialAPI";

export type BookingMaterialAPI = {
    id: number;
    booking_id: number;
    bahan_laboratorium_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    laboratory_material?: LaboratoryMaterialAPI
}

export function toDomain(api: BookingMaterialAPI): BookingMaterial {
    return new BookingMaterial(
        api.id,
        api.booking_id,
        api.bahan_laboratorium_id,
        api.quantity,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.laboratory_material ? toLaboratoryMaterial(api.laboratory_material) : undefined
    )
}