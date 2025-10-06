import { PracticumModuleSelect } from "@/domain/practicum-module/PracticumModuleSelect"

export type PracticumModuleSelectAPI = {
    id: number,
    name: string,
    practicum_id: number
}

export function toDomain(api: PracticumModuleSelectAPI): PracticumModuleSelect {
    return new PracticumModuleSelect(
        api.id,
        api.name,
        api.practicum_id
    )
}