import { Institution } from "../institution/Institution";
import { StudyProgram } from "../study-program/StudyProgram";
import { userRole } from "./UserRole";

export class User {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: userRole,
        readonly studyProgramId: number,
        readonly identityNum: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly studyProgram?: StudyProgram,
        readonly institution?: Institution
    ){}
}