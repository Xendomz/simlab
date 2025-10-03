import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryEquipment } from "./LaboratoryEquipment"

export interface ILaboratoryEquipmentRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryEquipment>>
    createData(data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}