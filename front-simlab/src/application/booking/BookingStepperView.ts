import { BookingStepperStatus } from "@/domain/booking/BookingStepperStatus";
import { TimeView } from "../time/TimeView";
import { BookingStepper } from "@/domain/booking/BookingStepper";


export class BookingStepperView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly status: BookingStepperStatus,
        readonly information: string,
        readonly approvedAt?: TimeView,
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