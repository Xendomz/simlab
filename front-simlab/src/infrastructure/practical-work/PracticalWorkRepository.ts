import { PracticalWorkTableParam } from "@/application/practical-work/dto/PracticalWorkDTO";
import { IPracticalWorkRepository } from "../../domain/practical-work/IPracticalWorkRepository";
import { PracticalWork } from "../../domain/practical-work/PracticalWork";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { PracticalWorkAPI, toDomain } from "./PracticalWorkAPI";

export class PracticalWorkRepository implements IPracticalWorkRepository {
    async getAll(params: PracticalWorkTableParam): Promise<PaginatedResponse<PracticalWork>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/practical-works?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticalWorkAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }

        throw json['message'];
    }

    async createData(data: Record<string, any>): Promise<ApiResponse<PracticalWork>> {
        const response = await fetchApi('/practical-works', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: Record<string, any>): Promise<ApiResponse<PracticalWork>> {
        const response = await fetchApi(`/practical-works/${id}`, {
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
        const response = await fetchApi(`/practical-works/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}