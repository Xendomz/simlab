import { BookingStepperStatus } from "@/domain/booking/BookingStepperStatus";
import { TimeView } from "../time/TimeView";
import { BookingStepper } from "@/domain/booking/BookingStepper";
import { BookingApprovalAction } from "@/domain/booking/BookingApprovalAction";


export class BookingStepperView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: BookingApprovalAction,
        readonly status: BookingStepperStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: TimeView,
        readonly approver?: string
    ) { }

    static fromDomain(entity: BookingStepper): BookingStepperView {
        return new BookingStepperView(
            entity.id,
            entity.role,
            entity.action,
            entity.status,
            entity.description,
            entity.information,
            entity.approvedAt ? TimeView.fromDomain(entity.approvedAt) : undefined,
            entity.approver ?? undefined
        );
    }
}