import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { Practicum } from "./Practicum"
import { PracticumSelect } from "./PracticumSelect"

export interface IPracticumRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_study_program?: number
    }): Promise<PaginatedResponse<Practicum>>
    createData(data: {
        code: string;
        name: string;
        study_program_id: number | null;
        sks: number
    }): Promise<ApiResponse<Practicum>>
    updateData(id: number, data: {
        code: string;
        name: string;
        study_program_id: number | null;
        sks: number
    }): Promise<ApiResponse<Practicum>>
    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<PracticumSelect[]>>
}