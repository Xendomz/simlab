import { PracticumSelect } from "@/domain/practicum/PracticumSelect"

export type PracticumSelectAPI = {
    id: number,
    name: string
}

export function toDomain(api: PracticumSelectAPI): PracticumSelect {
    return new PracticumSelect(
        api.id,
        api.name
    )
}