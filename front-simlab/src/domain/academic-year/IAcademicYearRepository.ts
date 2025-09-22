import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { AcademicYear } from "./AcademicYear";

export interface IAdacemicYearRepository {
    getAll(params: { page: number, per_page: number, search: string}): Promise<PaginatedResponse<AcademicYear>>
    createData(data: { name: string }): Promise<ApiResponse<AcademicYear>>
    updateData(id: number, data: { name: string }): Promise<ApiResponse<AcademicYear>>
    toggleStatus(id:number): Promise<ApiResponse<AcademicYear>>
    deleteData(id:number): Promise<ApiResponse>
}