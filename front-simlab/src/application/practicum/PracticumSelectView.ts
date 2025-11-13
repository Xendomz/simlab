import { PracticumSelect } from "@/domain/practicum/PracticumSelect";
import { PracticumModuleSelectView } from "../practicum-module/PracticumModuleSelectView";

export class PracticumSelectView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumModules?: PracticumModuleSelectView[]
    ){}

    static fromDomain(entity: PracticumSelect): PracticumSelectView {
        return new PracticumSelectView(
            entity.id,
            entity.name,
            entity.practicumModules ? entity.practicumModules.map(PracticumModuleSelectView.fromDomain) : undefined
        )
    }
}