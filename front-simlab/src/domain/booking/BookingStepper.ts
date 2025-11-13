import { Time } from "../time/Time";
import { BookingApprovalAction } from "./BookingApprovalAction";
import { BookingStepperStatus } from "./BookingStepperStatus";

export class BookingStepper {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: BookingApprovalAction,
        readonly status: BookingStepperStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string
    ){}
}