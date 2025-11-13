import { IPracticumRepository } from "@/domain/practicum/IPracticumRepository";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { PracticumAPI, toDomain } from "./PracticumAPI";
import { Practicum } from "@/domain/practicum/Practicum";
import { generateQueryStringFromObject } from "../Helper";
import { PracticumSelect } from "@/domain/practicum/PracticumSelect";
import { PracticumSelectAPI, toDomain as toPracticumSelect } from "./PracticumSelectAPI";

export class PracticumRepository implements IPracticumRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_study_program?: number
    }): Promise<PaginatedResponse<Practicum>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/practicums?${queryString}`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<PracticumAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }

        throw json['message'];
    }

    async createData(data: {
        code: string;
        name: string;
        study_program_id: number | null;
        sks: number
    }): Promise<ApiResponse<Practicum>> {
        const response = await fetchApi('/practicums', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: {
        code: string;
        name: string;
        study_program_id: number | null;
        sks: number
    }): Promise<ApiResponse<Practicum>> {
        const response = await fetchApi(`/practicums/${id}`, {
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
        const response = await fetchApi(`/practicums/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getDataForSelect(): Promise<ApiResponse<PracticumSelect[]>> {
        const response = await fetchApi(`/practicums/select`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PracticumSelectAPI[]

            return {
                ...json,
                data: data.map(toPracticumSelect)
            }
        }
        throw json
    }
}