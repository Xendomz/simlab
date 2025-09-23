export interface MajorInputDTO {
    faculty_id: number | null;
    code: string;
    name: string;
}

export interface MajorTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_faculty?: number
}