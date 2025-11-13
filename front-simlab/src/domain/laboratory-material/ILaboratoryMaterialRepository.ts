import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryMaterial } from "./LaboratoryMaterial"

export interface ILaboratoryMaterialRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryMaterial>>
    createData(data: {
        code: string;
        laboratory_room_id: number | undefined;
        material_name: string;
        brand: string;
        stock: number;
        unit: string;
        purchase_date: Date | undefined;
        expiry_date: Date | undefined;
        description: string;
        refill_date: Date | undefined;
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        code: string;
        laboratory_room_id: number | undefined;
        material_name: string;
        brand: string;
        stock: number;
        unit: string;
        purchase_date: Date | undefined;
        expiry_date: Date | undefined;
        description: string;
        refill_date: Date | undefined;
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}