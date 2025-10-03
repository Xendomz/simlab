import { Major } from "../../domain/major/Major";
import { FacultyAPI, toDomain as toFaculty } from "../faculty/FacultyAPI";

export type MajorAPI= {
    id: number;
    code: string;
    name: string;
    created_at: Date | null;
    updated_at: Date | null;
    faculty?: FacultyAPI
}

export function toDomain(api: MajorAPI): Major {
    return new Major(
        api.id,
        api.code,
        api.name,
        api.created_at,
        api.updated_at,
        api.faculty ? toFaculty(api.faculty) : undefined
    )
}