import { LaboratoryRoom } from "../../domain/laboratory-room/LaboratoryRoom"
import { UserApi } from "../user/UserApi"
import { toDomain as toUser } from "../user/UserApi"

export type LaboratoryRoomAPI = {
    id: number,
    name: string,
    floor: string,
    user_id: string,
    student_price: number,
    lecturer_price: number,
    external_price: number,
    created_at: Date | null,
    updated_at: Date | null,
    user?: UserApi
}

export function toDomain(api: LaboratoryRoomAPI): LaboratoryRoom {
    return new LaboratoryRoom(
        api.id,
        api.name,
        api.floor,
        api.user_id,
        api.student_price,
        api.lecturer_price,
        api.external_price,
        api.created_at,
        api.updated_at,
        api.user
            ? toUser(api.user)
            : undefined
    );
}