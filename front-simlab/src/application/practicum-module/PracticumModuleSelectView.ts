import { PracticumModuleSelect } from "@/domain/practicum-module/PracticumModuleSelect";

export class PracticumModuleSelectView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumId: number
    ){}

    static fromDomain(entity: PracticumModuleSelect): PracticumModuleSelectView {
        return new PracticumModuleSelectView(
            entity.id,
            entity.name,
            entity.practicumId
        )
    }
}