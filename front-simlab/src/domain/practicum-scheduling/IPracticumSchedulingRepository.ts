import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumScheduling } from "./PracticumScheduling";
import { PracticumStepper } from "./PracticumStepper";

export interface IPracticumSchedulingRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<PracticumScheduling>>;
    getPracticumSchedulingForVerification(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<PracticumScheduling>>

    create(data: {
        praktikum_id: number | null;
        ruangan_laboratorium_id: number | null;
        phone_number: string;
        groups: {
            group_name: string;
            practicum_assistant: string;
            practicum_session: string;
            start_time: Date | undefined;
            end_time: Date | undefined;
            total_participant: number;
        }[];
    }): Promise<ApiResponse<PracticumScheduling>>;

    getPracticumSchedulingData(id: number): Promise<ApiResponse<PracticumScheduling>>
    storePracticumSchedulingEquipmentMaterial(id: number, data: {
        practicumSchedulingEquipments: { id: number, quantity: number }[],
        practicumSchedulingMaterials: { id: number, quantity: number }[],
    }): Promise<ApiResponse>

    verify(id: number, data: { action: 'approve' | 'reject', information?: string, laboran_id?: number }): Promise<ApiResponse>
    isStillHaveDraftPracticum(): Promise<ApiResponse<boolean>>
    getPracticumSteps(id: number): Promise<ApiResponse<PracticumStepper[]>>
}