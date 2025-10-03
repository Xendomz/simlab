export interface PracticumInputDTO {
    code: string;
    name: string;
    study_program_id: number | null;
    sks: number
} 

export interface PracticumTableParam {
    page: number,
    per_page: number,
    search: string,
    filter_study_program?: number
}