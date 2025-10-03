import { PracticumSession } from "@/domain/practicum-scheduling/PracticumSession"
import { Time } from "@/domain/time/Time"

export type PracticumSessionAPI = {
    start_time: string,
    end_time: string,
    is_class_conducted: number | null,
    laboran_comment: string | null,
    laboran_commented_at: string | null,
    lecturer_comment: string | null,
    lecturer_commented_at: string | null
}

export function toDomain(api: PracticumSessionAPI): PracticumSession {
    return new PracticumSession(
        new Time(api.start_time),
        new Time(api.end_time),
        api.is_class_conducted,
        api.laboran_comment,
        api.laboran_commented_at ? new Time(api.laboran_commented_at) : null,
        api.lecturer_comment,
        api.lecturer_commented_at ? new Time(api.lecturer_commented_at) : null
    )
}