import { Faculty } from "@/domain/faculty/Faculty";

export type FacultyAPI = {
    id: number;
    code: string;
    name: string;
}

export function toDomain(api: FacultyAPI): Faculty {
    return new Faculty(
        api.id,
        api.code,
        api.name
    )
}