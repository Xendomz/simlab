import { userRole } from "@/domain/User/UserRole";
import { User } from "../../domain/User/User";
import { StudyProgramAPI, toDomain as toStudyProgram } from "../study-program/StudyProgramAPI";
import { InstitutionAPI, toDomain as toInstitution } from "../institution/InstitutionAPI";

export type UserApi = {
    id: number,
    name: string,
    email: string,
    role: string,
    prodi_id: number,
    identity_num: string,
    created_at: Date,
    updated_at: Date
    study_program?: StudyProgramAPI,
    institution?: InstitutionAPI
}

export function toDomain(api: UserApi): User {
    return new User(
        api.id,
        api.name,
        api.email,
        api.role as userRole,
        api.prodi_id,
        api.identity_num,
        api.created_at,
        api.updated_at,
        api.study_program ? toStudyProgram(api.study_program) : undefined,
        api.institution ? toInstitution(api.institution) : undefined
    )
}