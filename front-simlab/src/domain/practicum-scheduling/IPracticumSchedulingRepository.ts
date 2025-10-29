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

    getPracticumSchedulingByLecturer(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<PracticumScheduling>>

    create(data: {
        practicum_id: number | null,
        phone_number: string,
        classes: {
            lecturer_id: number | null,
            laboratory_room_id: number | null,
            name: string,
            practicum_assistant: string,
            total_participant: number | null,
            total_group: number | null,
            sessions: {
                practicum_module_id: number | null,
                start_time: Date | null,
                end_time: Date | null
            }[]
        }[]
    }): Promise<ApiResponse<PracticumScheduling>>;

    getPracticumSchedulingData(id: number): Promise<ApiResponse<PracticumScheduling>>
    storePracticumSchedulingEquipmentMaterial(id: number, data: {
        practicumSchedulingEquipments: { id: number, quantity: number | null }[],
        proposedEquipments: { name: string, quantity: number | null }[],
        practicumSchedulingMaterials: { id: number, quantity: number | null }[],
    }): Promise<ApiResponse>

    setSessionConducted(id: number, data: {
        session_id: number,
        status: boolean,
        information: string | null
    }): Promise<ApiResponse>

    setLecturerNote(id: number, data: {
        session_id: number,
        information: string | null
    }): Promise<ApiResponse>

    verify(id: number, data: {
        action: 'approve' | 'reject' | 'revision',
        laboran_id?: number,
        information?: string,
        materials?: number[]
    }): Promise<ApiResponse>
    isStillHaveDraftPracticum(): Promise<ApiResponse<boolean>>
    getPracticumSteps(id: number): Promise<ApiResponse<PracticumStepper[]>>
}