import { AcademicYear } from "../../domain/academic-year/AcademicYear";
import { IAdacemicYearRepository } from "../../domain/academic-year/IAcademicYearRepository";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { AcademicYearAPI, toDomain } from "./AcademicYearAPI";
import { generateQueryStringFromObject } from "../Helper";

export class AcademicYearRepository implements IAdacemicYearRepository {
    async getAll(params: { page: number, per_page: number, search: string}): Promise<PaginatedResponse<AcademicYear>> {
        const queryString = generateQueryStringFromObject(params);

        const response = await fetchApi(`/academic-years?${queryString}`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<AcademicYearAPI>;
            return {
                ...data,
                data: data.data?.map(toDomain) || []
            };
        }
        throw json;

    }
    async createData(data: { name: string }): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi('/academic-years', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as AcademicYearAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }
    async updateData(id: number, data: { name: string }): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi(`/academic-years/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as AcademicYearAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }

        throw json
    }
    async toggleStatus(id: number): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi(`/academic-years/${id}/toggle-status`, {
            method: 'PUT',
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as AcademicYearAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/academic-years/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as AcademicYearAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }

        throw json
    }
}