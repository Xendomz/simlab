import { ApiResponse, PaginatedResponse } from "../../shared/Types"
import { Major } from "./Major"
import { MajorSelect } from "./MajorSelect"

export interface IMajorReporsitory {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_faculty?: number
    }): Promise<PaginatedResponse<Major>>
    createData(data: {
        faculty_id: number | null;
        code: string;
        name: string;
    }): Promise<ApiResponse<Major>>
    updateData(id: number, data: {
        faculty_id: number | null;
        code: string;
        name: string;
    }): Promise<ApiResponse<Major>>
    deleteData(id: number): Promise<ApiResponse>
    getDataForSelect(): Promise<ApiResponse<MajorSelect[]>>
}