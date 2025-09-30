import { Institution } from "@/domain/institution/Institution";

export class InstitutionView {
    constructor(
        readonly name: string
    ) {}

    static fromDomain(entity: Institution): InstitutionView {
        return new InstitutionView(
            entity.name
        )
    }
}