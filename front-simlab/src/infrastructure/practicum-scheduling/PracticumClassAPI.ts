import { PracticumClass } from "@/domain/practicum-scheduling/PracticumClass";
import { Time } from "@/domain/time/Time";
import { UserApi, toDomain as toUser } from "../user/UserApi";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";
import { PracticumSessionAPI, toDomain as toPracticumSesion } from "./PracticumSessionAPI";

export type PracticumClassAPI = {
    id: number;
    name: string;
    practicum_assistant: string;
    total_participant: number;
    total_group: number;
    created_at: string;
    updated_at: string;
    lecturer?: UserApi,
    laboratory_room?: LaboratoryRoomAPI,
    practicum_sessions: PracticumSessionAPI[]
}

export function toDomain(api: PracticumClassAPI): PracticumClass {
    return new PracticumClass(
        api.id,
        api.name,
        api.practicum_assistant,
        api.total_participant,
        api.total_group,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.lecturer ? toUser(api.lecturer) : undefined,
        api.laboratory_room ? toLaboratoryRoom(api.laboratory_room) : undefined,
        api.practicum_sessions ? api.practicum_sessions.map(toPracticumSesion) : undefined
    )
}