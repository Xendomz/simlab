import { PracticumStepper } from "@/domain/practicum-scheduling/PracticumStepper";
import { TimeView } from "../time/TimeView";


export class PracticumStepperView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly status: "approved" | "rejected" | "pending",
        readonly information: string,
        readonly approved_at?: TimeView,
        readonly approver?: string
    ){}

    static fromDomain(entity: PracticumStepper): PracticumStepperView {
        return new PracticumStepperView(
            entity.id,
            entity.role,
            entity.status,
            entity.information,
            entity.approvedAt ? TimeView.fromDomain(entity.approvedAt) : undefined,
            entity.approver ?? undefined
        );
    }
}