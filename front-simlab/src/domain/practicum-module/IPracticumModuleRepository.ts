import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumModule } from "./PracticumModule";

export interface IPracticumModuleRepository {
    getAll(params: {
        page: number,
        per_page: number, 
        search: string,
        filter_practicum: number
    }): Promise<PaginatedResponse<PracticumModule>>
    createData(data: {
        name: string,
        practicum_id: number | null
    }): Promise<ApiResponse<PracticumModule>>
    updateData(id: number, data: {
        name: string,
        practicum_id: number | null
    }): Promise<ApiResponse<PracticumModule>>
    toggleStatus(id: number): Promise<ApiResponse<PracticumModule>>
    deleteData(id: number): Promise<ApiResponse>
}