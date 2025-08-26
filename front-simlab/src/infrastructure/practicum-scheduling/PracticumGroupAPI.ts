import { PracticumGroup } from "@/domain/practicum-scheduling/PracticumGroup";
import { Time } from "@/domain/time/Time";

export type PracticumGroupAPI = {
    id: number;
    group_name: string;
    practicum_assistant: string;
    practicum_session: string;
    start_time: string;
    end_time: string;
    practicum_scheduling_id: number;
    total_participant: number;
    created_at: string;
    updated_at: string;
}

export function toDomain(api: PracticumGroupAPI): PracticumGroup {
    return new PracticumGroup(
        api.id,
        api.group_name,
        api.practicum_assistant,
        api.practicum_session,
        new Time(api.start_time),
        new Time(api.end_time),
        api.practicum_scheduling_id,
        api.total_participant,
        new Time(api.created_at),
        new Time(api.updated_at)
    )
}