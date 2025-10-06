import { UserSelect } from "@/domain/User/UserSelect";

export type UserSelectAPI = {
    id: number;
    name: string
}

export function toDomain(api: UserSelectAPI): UserSelect {
    return new UserSelect(
        api.id,
        api.name
    )
}