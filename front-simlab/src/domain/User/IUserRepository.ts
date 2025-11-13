import { User } from "./User"
import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { userRole } from "./UserRole"
import { UserSelect } from "./UserSelect"

export interface IUserRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_study_program?: number,
        role: userRole
    }): Promise<PaginatedResponse<User>>
    createData(data: {
        name: string | null,
        email: string | null,
        role: string | null,
        study_program_id: number | null,
        identity_num: string | null,
        password: string | null
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        name: string | null,
        email: string | null,
        role: string | null,
        study_program_id: number | null,
        identity_num: string | null,
        password: string | null
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    restoreToDosen(id: number): Promise<ApiResponse>
    getDataForSelect(role: userRole): Promise<ApiResponse<UserSelect[]>>
}