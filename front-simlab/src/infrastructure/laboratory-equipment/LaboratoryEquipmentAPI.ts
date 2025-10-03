import { LaboratoryEquipment } from "../../domain/laboratory-equipment/LaboratoryEquipment";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";

export type LaboratoryEquipmentAPI = {
    id: number;
    equipment_name: string;
    quantity: number;
    unit: string;
    function: string;
    photo: string;
    brand: string;
    equipment_type: string;
    origin: string;
    condition: string;
    condition_description: string;
    asset_code: string;
    student_price: number;
    lecturer_price: number;
    external_price: number;
    created_at: Date | null;
    updated_at: Date | null;
    laboratory_room?: LaboratoryRoomAPI
}

export function toDomain(api: LaboratoryEquipmentAPI): LaboratoryEquipment {
    return new LaboratoryEquipment(
        api.id,
        api.equipment_name,
        api.quantity,
        api.unit,
        api.function,
        api.photo,
        api.brand,
        api.equipment_type,
        api.origin,
        api.condition,
        api.condition_description,
        api.asset_code,
        api.student_price,
        api.lecturer_price,
        api.external_price,
        api.created_at,
        api.updated_at,
        api.laboratory_room ? toLaboratoryRoom(api.laboratory_room) : undefined
    );
}