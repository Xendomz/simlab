import { PracticumStepper } from "@/domain/practicum-scheduling/PracticumStepper";
import { TimeView } from "../time/TimeView";
import { PracticumStepperStatus } from "@/domain/practicum-scheduling/PracticumStepperStatus";


export class PracticumStepperView {
    constructor(
        readonly role: string,
        readonly status: PracticumStepperStatus,
        readonly information: string | null,
        readonly approvedAt?: TimeView,
        readonly approver?: string
    ){}

    static fromDomain(entity: PracticumStepper): PracticumStepperView {
        return new PracticumStepperView(
            entity.role,
            entity.status,
            entity.information,
            entity.approvedAt ? TimeView.fromDomain(entity.approvedAt) : undefined,
            entity.approver ?? undefined
        );
    }
}