
import { IPracticumSchedulingRepository } from "@/domain/practicum-scheduling/IPracticumSchedulingRepository";
import { PracticumSchedulingAPI, toDomain } from "./PracticumSchedulingAPI";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumScheduling } from "@/domain/practicum-scheduling/PracticumScheduling";
import { fetchApi } from "../ApiClient";

export class PracticumSchedulingRepository implements IPracticumSchedulingRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<PracticumScheduling>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

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

    async create(data: { praktikum_id: number | null; ruangan_laboratorium_id: number | null; phone_number: string; groups: { group_name: string; practicum_assistant: string; practicum_session: string; start_time: Date | undefined; end_time: Date | undefined; total_participant: number; }[]; }): Promise<ApiResponse<PracticumScheduling>> {
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

    async storePracticumSchedulingEquipmentMaterial(id: number, data: { practicumSchedulingEquipments: { id: number; quantity: number; }[]; practicumSchedulingMaterials: { id: number; quantity: number; }[]; }): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-schedule/${id}/equipment-n-material`, {
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
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

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


    async verify(id: number, data: { action: 'approve' | 'reject', information?: string, laboran_id?: number, ruangan_laboratorium_id?: number }): Promise<ApiResponse> {
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
}
