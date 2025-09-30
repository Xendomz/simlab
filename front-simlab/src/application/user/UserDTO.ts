import { userRole } from "@/domain/User/UserRole"

export interface UserTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_study_program?: number,
    role: userRole
}

export interface UserInputDTO {
    name: string | null,
    email: string | null,
    role: string | null,
    study_program_id: number | null,
    identity_num: string | null,
    password: string | null
}

export interface DosenInputDTO {
    name: string,
    email: string,
    role: string,
    study_program_id: number,
    identity_num: string,
    password: string
}