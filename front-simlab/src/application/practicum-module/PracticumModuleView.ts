import { PracticumModule } from "@/domain/practicum-module/PracticumModule";
import { PracticumView } from "../practicum/PracticumView";

export class PracticumModuleView {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly status: 'Active' | 'Deactive',
        readonly practicum?: PracticumView
    ){}

    static fromDomain(entity: PracticumModule): PracticumModuleView {
        return new PracticumModuleView(
            entity.id,
            entity.name,
            entity.status,
            entity.practicum ? PracticumView.fromDomain(entity.practicum) : undefined
        )
    }
}