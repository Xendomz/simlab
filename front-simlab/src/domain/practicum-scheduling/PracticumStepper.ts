import { Time } from "../time/Time";

export class PracticumStepper {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly status: 'approved' | 'rejected' | 'pending',
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string
    ){}
}