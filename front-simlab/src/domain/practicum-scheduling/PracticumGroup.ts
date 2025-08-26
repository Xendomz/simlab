import { Time } from "../time/Time";

export class PracticumGroup {
    constructor(
        readonly id: number,
        readonly groupName: string,
        readonly practicumAssistant: string,
        readonly practicumSession: string,
        readonly startTime: Time,
        readonly endTime: Time,
        readonly practicumSchedulingId: number,
        readonly totalParticipant: number,
        readonly createdAt: Time,
        readonly updatedAt: Time
    ){}
}