import { PracticumSelect } from "@/domain/practicum/PracticumSelect";

export class PracticumSelectView {
    constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: PracticumSelect): PracticumSelectView {
        return new PracticumSelectView(
            entity.id,
            entity.name
        )
    }
}