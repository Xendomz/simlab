import { PracticumGroup } from "@/domain/practicum-scheduling/PracticumGroup";
import { TimeView } from "../time/TimeView";

export class PracticumGroupView {
    constructor(
        readonly id: number,
        readonly groupName: string,
        readonly practicumAssistant: string,
        readonly practicumSession: string,
        readonly startTime: TimeView,
        readonly endTime: TimeView,
        readonly practicumSchedulingId: number,
        readonly totalParticipant: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView
    ) { }

    static fromDomain(entity: PracticumGroup): PracticumGroupView {
        return new PracticumGroupView(
            entity.id,
            entity.groupName,
            entity.practicumAssistant,
            entity.practicumSession,
            TimeView.fromDomain(entity.startTime),
            TimeView.fromDomain(entity.endTime),
            entity.practicumSchedulingId,
            entity.totalParticipant,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
        )
    }
}