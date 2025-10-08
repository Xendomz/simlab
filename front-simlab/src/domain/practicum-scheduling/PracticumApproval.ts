import { Time } from "../time/Time";
import { User } from "../User/User";

export class PracticumApproval {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly approverId: number,
        readonly isApproved: number,
        readonly information: string,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly approver?: User,
    ){}
}