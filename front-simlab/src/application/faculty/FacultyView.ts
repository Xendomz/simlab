import { Faculty } from "@/domain/faculty/Faculty";

export class FacultyView {
    constructor(
        readonly id: number,
        readonly code: string,
        readonly name: string,
    ){}

    static fromDomain(entity: Faculty): FacultyView {
        return new FacultyView(
            entity.id,
            entity.code,
            entity.name
        )
    }
}