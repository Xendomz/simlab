import { Time } from "../time/Time";
import { BookingStepperStatus } from "./BookingStepperStatus";

export class BookingStepper {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly status: BookingStepperStatus,
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string
    ){}
}