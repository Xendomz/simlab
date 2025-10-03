import { AcademicYear } from "../../domain/academic-year/AcademicYear";

export type AcademicYearAPI = {
    id: number;
    name: string;
    status: 'Active' | 'Deactive';
    created_at: Date | null;
    updated_at: Date | null;
}

export function toDomain(api: AcademicYearAPI): AcademicYear  {
    return new AcademicYear(
        api.id,
        api.name,
        api.status,
        api.created_at,
        api.updated_at
    )
}