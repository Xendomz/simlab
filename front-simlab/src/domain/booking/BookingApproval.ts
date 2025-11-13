import { Time } from "../time/Time";
import { BookingApprovalAction } from "./BookingApprovalAction";
import { BookingApprovalStatus } from "./BookingApprovalStatus";

export class BookingApproval {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: BookingApprovalAction,
        readonly status: BookingApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string,
    ){}
}