import { LaboratoryMaterial } from "../../domain/laboratory-material/LaboratoryMaterial";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";

export type LaboratoryMaterialAPI = {
    id: number;
    code: string;
    material_name: string;
    brand: string;
    stock: number;
    unit: string;
    purchase_date: Date;
    expiry_date: Date;
    description: string;
    refill_date: Date;
    student_price: number;
    lecturer_price: number;
    external_price: number;
    created_at: Date | null;
    updated_at: Date | null;
    laboratory_room: LaboratoryRoomAPI
}

export function toDomain(api: LaboratoryMaterialAPI): LaboratoryMaterial {
    return new LaboratoryMaterial(
        api.id,
        api.code,
        api.material_name,
        api.brand,
        api.stock,
        api.unit,
        api.purchase_date,
        api.expiry_date,
        api.description,
        api.refill_date,
        api.student_price,
        api.lecturer_price,
        api.external_price,
        api.created_at,
        api.updated_at,
        api.laboratory_room ? toLaboratoryRoom(api.laboratory_room) : undefined
    );
}