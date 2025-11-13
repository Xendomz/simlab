import { Time } from "../time/Time";
import { PracticumStepperStatus } from "./PracticumStepperStatus";

export class PracticumStepper {
    constructor(
        readonly role: string,
        readonly status: PracticumStepperStatus,
        readonly information: string | null,
        readonly approvedAt?: Time,
        readonly approver?: string
    ){}
}