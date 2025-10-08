import { Time } from "../time/Time";
import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";
import { User } from "../User/User";
import { PracticumSession } from "./PracticumSession";

export class PracticumClass {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumAssistant: string,
        readonly totalParticipant: number,
        readonly totalGroup: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly lecturer?: User,
        readonly laboratoryRoom?: LaboratoryRoom,
        readonly practicumSessions?: PracticumSession[]
    ){}
}