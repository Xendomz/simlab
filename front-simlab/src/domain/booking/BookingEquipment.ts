import { LaboratoryEquipment } from "../laboratory-equipment/LaboratoryEquipment";
import { Time } from "../time/Time";

export class BookingEquipment {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly laboratoryEquipmentId: number,
        readonly quantity: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly laboratoryEquipment?: LaboratoryEquipment
    ){}
}