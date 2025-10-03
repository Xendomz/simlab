import { Practicum } from "@/domain/practicum/Practicum";
import { StudyProgramView } from "../study-program/StudyProgramView";

export class PracticumView {
    private constructor(
        readonly id: number,
        readonly code: string,
        readonly name: string,
        readonly studyProgramId: number,
        readonly sks: number,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgramView
    ) {}

    static fromDomain(entity: Practicum): PracticumView {
        return new PracticumView(
            entity.id,
            entity.code,
            entity.name,
            entity.studyProgramId,
            entity.sks,
            entity.createdAt,
            entity.updatedAt,
            entity.studyProgram ? StudyProgramView.fromDomain(entity.studyProgram) : undefined
        )
    }
}