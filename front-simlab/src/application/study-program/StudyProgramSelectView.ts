import { StudyProgramSelect } from "@/domain/study-program/StudyProgramSelect";

export class StudyProgramSelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: StudyProgramSelect): StudyProgramSelectView {
        return new StudyProgramSelectView(
            entity.id,
            entity.name
        )
    }
}