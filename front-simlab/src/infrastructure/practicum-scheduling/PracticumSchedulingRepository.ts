
import { IPracticumSchedulingRepository } from "@/domain/practicum-scheduling/IPracticumSchedulingRepository";
import { PracticumSchedulingAPI, toDomain } from "./PracticumSchedulingAPI";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumScheduling } from "@/domain/practicum-scheduling/PracticumScheduling";
import { fetchApi } from "../ApiClient";
import { PracticumStepper } from "@/domain/practicum-scheduling/PracticumStepper";
import { PracticumStepperAPI, toDomain as toPracticumStepper } from "./PracticumStepperAPI";
import { generateQueryStringFromObject } from "../Helper";

export class PracticumSchedulingRepository implements IPracticumSchedulingRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<PracticumScheduling>> {
        const queryString = generateQueryStringFromObject(params);
        const response = await fetchApi(`/practicum-schedule?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticumSchedulingAPI>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }

    async create(data: {
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
    }): Promise<ApiResponse<PracticumScheduling>> {
        const response = await fetchApi("/practicum-schedule", {
            method: "POST",
            body: JSON.stringify(data)
        });

        const json = await response.json() as ApiResponse;
        if (response.ok) {
            return {
                ...json,
                data: toDomain(json.data)
            };
        }
        throw json;
    }

    async getPracticumSchedulingData(id: number): Promise<ApiResponse<PracticumScheduling>> {
        const response = await fetchApi(`/practicum-schedule/${id}/detail`, {
            method: 'GET'
        });

        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PracticumSchedulingAPI

            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async getPracticumSchedulingByLecturer(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<PracticumScheduling>> {
        const queryString = generateQueryStringFromObject(params);

        const response = await fetchApi(`/practicum-schedule/my-classes?${queryString}`, {
            method: 'GET'
        })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticumSchedulingAPI>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }

    async storePracticumSchedulingEquipmentMaterial(id: number, data: { practicumSchedulingEquipments: { id: number; quantity: number | null; }[]; proposedEquipments: { name: string; quantity: number | null; }[]; practicumSchedulingMaterials: { id: number; quantity: number | null; }[]; }): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-schedule/${id}/equipment-material`, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async getPracticumSchedulingForVerification(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<PracticumScheduling>> {
        const queryString = generateQueryStringFromObject(params);

        const response = await fetchApi(`/practicum-schedule/verification?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticumSchedulingAPI>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }

    async setSessionConducted(id: number, data: { session_id: number; status: boolean; information: string | null; }): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-schedule/${id}/set-session-conducted`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const json = await response.json()
        if (response.ok) {
            return json;
        }
        throw json
    }

    async setLecturerNote(id: number, data: { session_id: number; information: string | null; }): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-schedule/${id}/set-lecturer-note`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const json = await response.json()
        if (response.ok) {
            return json;
        }
        throw json
    }

    async verify(id: number, data: { 
        action: 'approve' | 'reject' | 'revision',
        laboran_id?: number,
        information?: string,
        materials?: number[]
     }): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-schedule/${id}/verify`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const json = await response.json();
        if (response.ok) {
            return json;
        }
        throw json;
    }

    async isStillHaveDraftPracticum(): Promise<ApiResponse<boolean>> {
        const response = await fetchApi(`/practicum-schedule/have-draft`, {
            method: 'GET',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getPracticumSteps(id: number): Promise<ApiResponse<PracticumStepper[]>> {
        const response = await fetchApi(`/practicum-schedule/${id}/steps`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const list = json['data'] as PracticumStepperAPI[];
            return {
                ...json,
                data: list?.map(toPracticumStepper) || []
            }
        }
        throw json;
    }
}
