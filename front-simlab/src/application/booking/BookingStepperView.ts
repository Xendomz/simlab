import { TimeView } from "../time/TimeView";
import { BookingStepper } from "@/domain/booking/BookingStepper";


export class BookingStepperView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly status: "approved" | "rejected" | "pending",
        readonly information: string,
        readonly approved_at?: TimeView,
        readonly approver?: string
    ){}

    static fromDomain(entity: BookingStepper): BookingStepperView {
        return new BookingStepperView(
            entity.id,
            entity.role,
            entity.status,
            entity.information,
            entity.approvedAt ? TimeView.fromDomain(entity.approvedAt) : undefined,
            entity.approver ?? undefined
        );
    }
}