import { BookingApproval } from "@/domain/booking/BookingApproval";
import { TimeView } from "../time/TimeView";
import { UserView } from "../user/UserView";

export class BookingApprovalView {
    constructor(
        readonly id: number,
        readonly bookingId: number,
        readonly role: string,
        readonly approverId: number,
        readonly approved: boolean,
        readonly information: string,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly approver?: UserView
    ){}

    static fromDomain(entity: BookingApproval): BookingApprovalView {
        return new BookingApprovalView(
            entity.id,
            entity.bookingId,
            entity.role,
            entity.approverId,
            entity.approved,
            entity.information,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.approver ? UserView.fromDomain(entity.approver) : undefined
        );
    }
}