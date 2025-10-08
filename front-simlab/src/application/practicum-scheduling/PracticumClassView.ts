import { PracticumClass } from "@/domain/practicum-scheduling/PracticumClass";
import { TimeView } from "../time/TimeView";
import { UserView } from "../user/UserView";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";
import { PracticumSessionView } from "./PracticumSessionView";

export class PracticumClassView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumAssistant: string,
        readonly totalParticipant: number,
        readonly totalGroup: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly lecturer?: UserView,
        readonly laboratoryRoom?: LaboratoryRoomView,
        readonly practicumSessions?: PracticumSessionView[]
    ) { }

    static fromDomain(entity: PracticumClass): PracticumClassView {
        return new PracticumClassView(
            entity.id,
            entity.name,
            entity.practicumAssistant,
            entity.totalParticipant,
            entity.totalGroup,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.lecturer ? UserView.fromDomain(entity.lecturer) : undefined,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined,
            entity.practicumSessions ? entity.practicumSessions.map(PracticumSessionView.fromDomain) : undefined
        )
    }
}