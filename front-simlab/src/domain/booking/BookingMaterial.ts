import { LaboratoryMaterial } from "../laboratory-material/LaboratoryMaterial";
import { Time } from "../time/Time";

export class BookingMaterial {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly laboratoryMaterialId: number,
        readonly quantity: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly laboratoryMaterial?: LaboratoryMaterial
    ){}
}