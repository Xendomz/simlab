import { Faculty } from "../faculty/Faculty";

export class Major {
    constructor(
        readonly id: number,
        readonly code: string,
        readonly name: string,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
        readonly faculty?: Faculty
    ){}
}