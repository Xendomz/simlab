import { FacultySelect } from "@/domain/faculty/FacultySelect";

export type FacultySelectAPI = {
    id: number;
    name: string
}

export function toDomain(api: FacultySelectAPI): FacultySelect {
    return new FacultySelect(
        api.id,
        api.name
    )
}