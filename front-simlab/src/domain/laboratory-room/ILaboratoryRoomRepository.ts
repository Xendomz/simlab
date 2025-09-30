import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { LaboratoryRoom } from "./LaboratoryRoom"
import { LaboratoryRoomSelect } from "./LaboratoryRoomSelect"

export interface ILaboratoryRoomRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<LaboratoryRoom>>
    createData(data: {
        name: string,
        floor: string,
        user_id: number | null,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse<LaboratoryRoom>>
    updateData(id: number, data: {
        name: string,
        floor: string,
        user_id: number | null,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse<LaboratoryRoom>>
    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<LaboratoryRoomSelect[]>>
}