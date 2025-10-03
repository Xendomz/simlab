import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";

export class LaboratoryMaterial {
    constructor(
        readonly id: number,
        readonly code: string,
        readonly materialName: string,
        readonly brand: string,
        readonly stock: number,
        readonly unit: string,
        readonly purchaseDate: Date,
        readonly expiryDate: Date,
        readonly description: string,
        readonly refillDate: Date,
        readonly studentPrice: number,
        readonly lecturerPrice: number,
        readonly externalPrice: number,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly laboratoryRoom?: LaboratoryRoom
    ) { }
}