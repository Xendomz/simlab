export interface TestingTypeInputDTO {
    name: string,
    unit: string,
    student_price: number | null,
    lecturer_price: number | null,
    external_price: number | null
}

export interface TestingTypeTableParam {
    page: number,
    per_page: number,
    search: string,
}