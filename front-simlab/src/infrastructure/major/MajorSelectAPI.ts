import { MajorSelect } from "@/domain/major/MajorSelect";

export type MajorSelectAPI = {
    id: number;
    name: string
}

export function toDomain(api: MajorSelectAPI): MajorSelect {
    return new MajorSelect(
        api.id,
        api.name
    )
}