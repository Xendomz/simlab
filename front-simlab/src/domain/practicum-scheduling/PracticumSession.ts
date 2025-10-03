import { Time } from "../time/Time";

export class PracticumSession {
    constructor(
        readonly startTime: Time,
        readonly endTime: Time,
        readonly isClassConducted: number | null,
        readonly laboranComment: string | null,
        readonly laboranCommentedAt: Time | null,
        readonly lecturerComment: string | null,
        readonly lecturerCommentedAt: Time | null
    ){}
}