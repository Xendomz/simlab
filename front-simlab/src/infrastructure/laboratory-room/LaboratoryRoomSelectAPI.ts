import { LaboratoryRoomSelect } from "@/domain/laboratory-room/LaboratoryRoomSelect"

export type LaboratoryRoomSelectAPI = {
    id: number,
    name: string
}

export function toDomain(api: LaboratoryRoomSelectAPI): LaboratoryRoomSelect {
    return new LaboratoryRoomSelect(
        api.id,
        api.name
    )
}