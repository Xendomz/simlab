import { PracticumApproval } from "@/domain/practicum-scheduling/PracticumApproval";
import { TimeView } from "../time/TimeView";
import { UserView } from "../user/UserView";

export class PracticumApprovalView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly approverId: number,
        readonly isApproved: number,
        readonly information: string,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly approver?: UserView,
    ) { }

    static fromDomain(entity: PracticumApproval): PracticumApprovalView {
        return new PracticumApprovalView(
            entity.id,
            entity.role,
            entity.approverId,
            entity.isApproved,
            entity.information,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.approver ? UserView.fromDomain(entity.approver) : undefined
        )
    }
}