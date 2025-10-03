import { Major } from "@/domain/major/Major";
import { FacultyView } from "../faculty/FacultyView";

export class MajorView {
    private constructor(
        readonly id: number,
        readonly code: string,
        readonly name: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly faculty?: FacultyView
    ){}

    static fromDomain(entity: Major) {
        return new MajorView(
            entity.id,
            entity.code,
            entity.name,
            entity.createdAt,
            entity.updatedAt,
            entity.faculty ? FacultyView.fromDomain(entity.faculty) : undefined
        )
    }
}