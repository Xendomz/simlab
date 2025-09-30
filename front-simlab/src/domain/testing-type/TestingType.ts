export class TestingType {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly unit: string,
        readonly studentPrice: number,
        readonly lecturerPrice: number,
        readonly externalPrice: number,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}
}