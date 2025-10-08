import { PracticumApproval } from "@/domain/practicum-scheduling/PracticumApproval";
import { UserApi, toDomain as toUser } from "../user/UserApi";
import { Time } from "@/domain/time/Time";

export type PracticumApprovalAPI = {
    id: number;
    role: string;
    approver_id: number;
    is_approved: number
    information: string;
    created_at: string;
    updated_at: string
    approver?: UserApi,
}

export function toDomain(api: PracticumApprovalAPI): PracticumApproval {
    return new PracticumApproval(
        api.id,
        api.role,
        api.approver_id,
        api.is_approved,
        api.information,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.approver ? toUser(api.approver) : undefined
    )
}