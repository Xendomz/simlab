import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { StudyProgram } from "./StudyProgram"
import { StudyProgramSelect } from "./StudyProgramSelect"

export interface IStudyProgramRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_major?: number
    }): Promise<PaginatedResponse<StudyProgram>>
    createData(data: {
        major_id: number | null,
        name: string,
    }): Promise<ApiResponse>
    updateData(id: number, data: {
        major_id: number | null,
        name: string,
    }): Promise<ApiResponse>
    deleteData(id: number): Promise<ApiResponse>
    getPublicData(id: number): Promise<ApiResponse<StudyProgram[]>>
    getDataForSelect(): Promise<ApiResponse<StudyProgramSelect[]>>
}