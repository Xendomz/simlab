import { BookingEquipment } from "@/domain/booking/BookingEquipment";
import { Time } from "@/domain/time/Time";
import { LaboratoryEquipmentAPI, toDomain as toLaboratoryEquipment } from "../laboratory-equipment/LaboratoryEquipmentAPI";

export type BookingEquipmentAPI = {
    id: number;
    booking_id: number;
    alat_laboratorium_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    laboratory_equipment?: LaboratoryEquipmentAPI
}

export function toDomain(api: BookingEquipmentAPI): BookingEquipment {
    return new BookingEquipment(
        api.id,
        api.booking_id,
        api.alat_laboratorium_id,
        api.quantity,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.laboratory_equipment ? toLaboratoryEquipment(api.laboratory_equipment) : undefined
    )
}