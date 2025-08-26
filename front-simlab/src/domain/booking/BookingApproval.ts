import { Time } from "../time/Time";
import { User } from "../User/User";

export class BookingApproval {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly role: string,
        readonly approverId: number,
        readonly approved: boolean,
        readonly information: string,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly approver?: User
    ){}
}