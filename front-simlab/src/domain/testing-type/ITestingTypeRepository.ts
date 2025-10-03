import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { TestingType } from "./TestingType"

export interface ITestingTypeRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<TestingType>>
    createData(data: {
        name: string,
        unit: string,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        name: string,
        unit: string,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
}