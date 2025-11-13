export interface PracticumModuleTableParams {
    page: number,
    per_page: number,
    search: string,
    filter_practicum: number
}

export interface PracticumModuleInputDTO {
    name: string,
    practicum_id: number | null
}