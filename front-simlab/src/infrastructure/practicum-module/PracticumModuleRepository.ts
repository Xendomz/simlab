import { IPracticumModuleRepository } from "@/domain/practicum-module/IPracticumModuleRepository";
import { PracticumModule } from "@/domain/practicum-module/PracticumModule";
import { PaginatedResponse, ApiResponse } from "@/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { PracticumModuleAPI, toDomain } from "./PracticumModuleAPI";

export class PracticumModuleRepository implements IPracticumModuleRepository {
    async getAll(params: { page: number; per_page: number; search: string; filter_practicum: number }): Promise<PaginatedResponse<PracticumModule>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/practicum-modules?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticumModuleAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            }
        }

        throw json
    }
    async createData(data: { name: string; practicum_id: number | null; }): Promise<ApiResponse<PracticumModule>> {
        const response = await fetchApi(`/practicum-modules`, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PracticumModuleAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json

    }
    async updateData(id: number, data: { name: string; practicum_id: number | null; }): Promise<ApiResponse<PracticumModule>> {
        const response = await fetchApi(`/practicum-modules/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PracticumModuleAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }
    async toggleStatus(id: number): Promise<ApiResponse<PracticumModule>> {
        const response = await fetchApi(`/practicum-modules/${id}/toggle-status`, {
            method: 'PUT',
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PracticumModuleAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/practicum-years/${id}`, {
            method: 'DELETE'
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PracticumModuleAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }
}