import { MajorSelect } from "@/domain/major/MajorSelect";

export class MajorSelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: MajorSelect): MajorSelectView {
        return new MajorSelectView(
            entity.id,
            entity.name
        )
    }
}