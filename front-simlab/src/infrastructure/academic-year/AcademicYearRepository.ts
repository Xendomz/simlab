import { AcademicYearInputDTO, AcademicYearTableParam } from "@/application/academic-year/dtos/AcademicYearDTO";
import { AcademicYear } from "../../domain/academic-year/AcademicYear";
import { IAdacemicYearRepository } from "../../domain/academic-year/IAcademicYearRepository";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { AcademicYearAPI, toDomain } from "./AcademicYearAPI";

export class AcademicYearRepository implements IAdacemicYearRepository {
    async getAll(params: AcademicYearTableParam): Promise<PaginatedResponse<AcademicYear>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/academic-years?${queryString}`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<AcademicYearAPI>;
            return {
                ...data,
                data: data.data?.map(toDomain) || []
            };
        }
        throw json['message'];

    }
    async createData(data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi('/academic-years', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }
    async updateData(id: number, data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi(`/academic-years/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
    async toggleStatus(id: number): Promise<ApiResponse<AcademicYear>> {
        const response = await fetchApi(`/academic-years/${id}/toggle-status`, {
            method: 'PUT',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/academic-years/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}