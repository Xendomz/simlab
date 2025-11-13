import { BookingApproval } from "@/domain/booking/BookingApproval";
import { TimeView } from "../time/TimeView";
import { BookingApprovalAction } from "@/domain/booking/BookingApprovalAction";
import { BookingApprovalStatus } from "@/domain/booking/BookingApprovalStatus";

export class BookingApprovalView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: BookingApprovalAction,
        readonly status: BookingApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: TimeView,
        readonly approver?: string
    ) { }

    static fromDomain(entity: BookingApproval): BookingApprovalView {
        return new BookingApprovalView(
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

    formatedRoleLabel(): string {
        return this.role
            .replace(/_/g, ' ') // replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
    }
}