export interface LaboratoryRoomInputDTO {
    name: string,
    floor: string,
    user_id: number | null,
    student_price: number | null,
    lecturer_price: number | null,
    external_price: number | null
}

export interface LaboratoryRoomParam {
    page: number,
    per_page: number,
    search: string,
}