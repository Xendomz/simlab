import { User } from "./User"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { userRole } from "./UserRole"

export interface IUserRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_study_program?: number,
        role: userRole
    }): Promise<PaginatedResponse<User>>
    createData(data: {
        name: string,
        email: string,
        role: string,
        study_program_id: number | null,
        identity_num: string,
        password: string
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        name: string,
        email: string,
        role: string,
        study_program_id: number | null,
        identity_num: string,
        password: string
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    restoreToDosen(id: number): Promise<ApiResponse>
}