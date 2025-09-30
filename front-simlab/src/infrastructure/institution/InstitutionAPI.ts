import { Institution } from "@/domain/institution/Institution"

export type InstitutionAPI = {
    name: string,
}

export function toDomain(api: InstitutionAPI): Institution {
    return new Institution(
        api.name
    )
}