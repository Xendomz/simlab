import { LaboratoryRoomSelect } from "@/domain/laboratory-room/LaboratoryRoomSelect";

export class LaboratoryRoomSelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: LaboratoryRoomSelect): LaboratoryRoomSelectView {
        return new LaboratoryRoomSelectView(
            entity.id,
            entity.name
        )
    }
}