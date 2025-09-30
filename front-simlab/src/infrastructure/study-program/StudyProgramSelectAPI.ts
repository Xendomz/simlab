import { StudyProgramSelect } from "@/domain/study-program/StudyProgramSelect";

export type StudyProgramSelectAPI = {
    id: number;
    name: string
}

export function toDomain(api: StudyProgramSelectAPI): StudyProgramSelect {
    return new StudyProgramSelect(
        api.id,
        api.name
    )
}