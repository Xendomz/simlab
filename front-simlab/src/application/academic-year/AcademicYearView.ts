import { AcademicYear } from "@/domain/academic-year/AcademicYear";

export class AcademicYearView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly status: 'Active' | 'Deactive',
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}

    static fromDomain(entity: AcademicYear) {
        return new AcademicYearView(
            entity.id,
            entity.name,
            entity.status,
            entity.createdAt,
            entity.updatedAt
        )
    }
}