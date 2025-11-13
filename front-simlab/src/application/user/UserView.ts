import { User } from "@/domain/User/User";
import { StudyProgramView } from "../study-program/StudyProgramView";
import { userRole } from "@/domain/User/UserRole";
import { InstitutionView } from "../institution/InstitutionView.";

export class UserView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: userRole,
        readonly studyProgramId: number,
        readonly identityNum: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgramView,
        readonly institution?: InstitutionView
    ) { }

    static fromDomain(entity: User): UserView {
        return new UserView(
            entity.id,
            entity.name,
            entity.email,
            entity.role,
            entity.studyProgramId,
            entity.identityNum,
            entity.createdAt,
            entity.updatedAt,
            entity.studyProgram ? StudyProgramView.fromDomain(entity.studyProgram) : undefined,
            entity.institution ? InstitutionView.fromDomain(entity.institution) : undefined
        )
    }
}