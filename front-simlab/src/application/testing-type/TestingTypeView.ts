import { TestingType } from "../../domain/testing-type/TestingType";
import { MoneyView } from "../money/MoneyView";

export class TestingTypeView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly unit: string,
        readonly studentPrice: MoneyView,
        readonly lecturerPrice: MoneyView,
        readonly externalPrice: MoneyView,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null
    ){}

    static fromDomain(entity: TestingType) {
        return new TestingTypeView(
            entity.id,
            entity.name,
            entity.unit,
            MoneyView.toViewModel(entity.studentPrice),
            MoneyView.toViewModel(entity.lecturerPrice),
            MoneyView.toViewModel(entity.externalPrice),
            entity.createdAt,
            entity.updatedAt
        )
    }
}