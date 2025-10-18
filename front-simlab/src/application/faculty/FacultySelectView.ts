import { FacultySelect } from "@/domain/faculty/FacultySelect";

export class FacultySelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ) {}

    static fromDomain(entity: FacultySelect): FacultySelectView {
        return new FacultySelectView(
            entity.id,
            entity.name
        )
    }
}