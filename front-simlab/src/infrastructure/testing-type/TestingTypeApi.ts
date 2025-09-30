import { TestingType } from "../../domain/testing-type/TestingType"

export type TestingTypeApi = {
    id: number;
    name: string;
    unit: string;
    student_price: number;
    lecturer_price: number;
    external_price: number;
    created_at: Date | null;
    updated_at: Date | null;
}

export function toDomain(api: TestingTypeApi): TestingType {
    return new TestingType(
        api.id,
        api.name,
        api.unit,
        api.student_price,
        api.lecturer_price,
        api.external_price,
        api.created_at,
        api.updated_at
    )
}