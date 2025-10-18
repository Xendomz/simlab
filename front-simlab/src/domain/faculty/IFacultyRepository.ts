import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { Faculty } from "./Faculty";
import { FacultySelect } from "./FacultySelect";

export interface IFacultyRepository {
    getAll(params: { page: number, per_page: number, search: string }): Promise<PaginatedResponse<Faculty>>
    createData(data: { code: string, name: string }): Promise<ApiResponse<Faculty>>
    updateData(id: number, data: { code: string, name: string }): Promise<ApiResponse<Faculty>>
    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<FacultySelect[]>>
}