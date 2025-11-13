import { UserSelect } from "@/domain/User/UserSelect";

export class UserSelectView {
    private constructor(
        readonly id: number,
        readonly name: string
    ){}

    static fromDomain(entity: UserSelect): UserSelectView {
        return new UserSelectView(
            entity.id,
            entity.name
        )
    }
}