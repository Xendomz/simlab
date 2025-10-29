import { PracticumModule } from "../practicum-module/PracticumModule";
import { Time } from "../time/Time";

export class PracticumSession {
    constructor(
        readonly id: number,
        readonly startTime: Time,
        readonly endTime: Time,
        readonly isClassConducted: number | null,
        readonly laboranComment: string | null,
        readonly laboranCommentedAt: Time | null,
        readonly lecturerComment: string | null,
        readonly lecturerCommentedAt: Time | null,
        readonly practicumModule?: PracticumModule
    ){}
}