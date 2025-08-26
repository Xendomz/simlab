import { MajorInputDTO, MajorTableParam } from "@/application/major/dto/MajorDTO";
import { IMajorReporsitory } from "../../domain/major/IMajorRepository";
import { Major } from "../../domain/major/Major";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { MajorAPI, toDomain } from "./MajorAPI";

export class MajorRepository implements IMajorReporsitory {
    async getAll(params: MajorTableParam): Promise<PaginatedResponse<Major>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/majors?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<MajorAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }
        throw json['message'];
    }

    async createData(data: MajorInputDTO): Promise<ApiResponse> {
        const response = await fetchApi('/majors', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: MajorInputDTO): Promise<ApiResponse> {
        const response = await fetchApi(`/majors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/majors/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}