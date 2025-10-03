import { PracticumSession } from "@/domain/practicum-scheduling/PracticumSession";
import { TimeView } from "../time/TimeView";

export class PracticumSessionView {
    private constructor(
        readonly startTime: TimeView,
        readonly endTime: TimeView,
        readonly isClassConducted: number | null,
        readonly laboranComment: string | null,
        readonly laboranCommentedAt: TimeView | null,
        readonly lecturerComment: string | null,
        readonly lecturerCommentedAt: TimeView | null
    ) { }

    static fromDomain(entity: PracticumSession): PracticumSessionView {
        return new PracticumSessionView(
            TimeView.fromDomain(entity.startTime),
            TimeView.fromDomain(entity.endTime),
            entity.isClassConducted,
            entity.laboranComment,
            entity.laboranCommentedAt ? TimeView.fromDomain(entity.laboranCommentedAt) : null,
            entity.lecturerComment,
            entity.lecturerCommentedAt ? TimeView.fromDomain(entity.lecturerCommentedAt) : null
        )
    }
}