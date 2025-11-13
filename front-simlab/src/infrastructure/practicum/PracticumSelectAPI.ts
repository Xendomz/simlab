import { PracticumSelect } from "@/domain/practicum/PracticumSelect"
import { PracticumModuleSelectAPI, toDomain as toPracticumModuleSelect } from "../practicum-module/PracticumModuleSelectAPI"

export type PracticumSelectAPI = {
    id: number,
    name: string,
    practicum_modules?: PracticumModuleSelectAPI[]
}

export function toDomain(api: PracticumSelectAPI): PracticumSelect {
    return new PracticumSelect(
        api.id,
        api.name,
        api.practicum_modules ? api.practicum_modules.map(toPracticumModuleSelect) : undefined
    )
}