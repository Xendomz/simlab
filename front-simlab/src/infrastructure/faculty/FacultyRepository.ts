import { IFacultyRepository } from "@/domain/faculty/IFacultyRepository";
import { PaginatedResponse, ApiResponse } from "@/shared/Types";
import { generateQueryStringFromObject } from "../Helper";
import { fetchApi } from "../ApiClient";
import { FacultyAPI, toDomain } from "./FacultyAPI";
import { Faculty } from "@/domain/faculty/Faculty";
import { FacultySelect } from "@/domain/faculty/FacultySelect";

export class FacultyRepository implements IFacultyRepository {
    async getAll(params: { page: number; per_page: number; search: string; }): Promise<PaginatedResponse<Faculty>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/faculties?${queryString}`, { method: 'GET' })
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<FacultyAPI>
            return {
                ...data,
                data: data.data.map(toDomain) || []
            }
        }
        throw json
    }
    async createData(data: { code: string; name: string; }): Promise<ApiResponse<Faculty>> {
        const response = await fetchApi(`/faculties`, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as FacultyAPI
            return {
                ...json,
                data: toDomain(data)
            };
        }
        throw json
    }
    async updateData(id: number, data: { code: string; name: string; }): Promise<ApiResponse<Faculty>> {
        const response = await fetchApi(`/faculties/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as FacultyAPI
            return {
                ...json,
                data: toDomain(data)
            };
        }
        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/faculties/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as FacultyAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }

        throw json
    }

    async getDataForSelect(): Promise<ApiResponse<FacultySelect[]>> {
        const response = await fetchApi(`/faculties/select`)

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as FacultyAPI[]
            return {
                ...json,
                data: data.map(toDomain)
            }
        }
        throw json
    }
}