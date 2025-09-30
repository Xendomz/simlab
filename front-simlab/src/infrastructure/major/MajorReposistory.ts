import { MajorSelect } from "@/domain/major/MajorSelect";
import { IMajorReporsitory } from "../../domain/major/IMajorRepository";
import { Major } from "../../domain/major/Major";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { MajorAPI, toDomain } from "./MajorAPI";
import { MajorSelectAPI, toDomain as toMajorSelect } from "./MajorSelectAPI";
import { generateQueryStringFromObject } from "../Helper";

export class MajorRepository implements IMajorReporsitory {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_faculty?: number
    }): Promise<PaginatedResponse<Major>> {
        const queryString = generateQueryStringFromObject(params)

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

    async createData(data: {
        faculty_id: number | null;
        code: string;
        name: string;
    }): Promise<ApiResponse<Major>> {
        const response = await fetchApi('/majors', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as MajorAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async updateData(id: number, data: {
        faculty_id: number | null;
        code: string;
        name: string;
    }): Promise<ApiResponse<Major>> {
        const response = await fetchApi(`/majors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            const data = json.data as MajorAPI
            return {
                ...json,
                data: toDomain(data)
            }
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

    async getDataForSelect(): Promise<ApiResponse<MajorSelect[]>> {
        const response = await fetchApi(`/majors/select`)

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as MajorSelectAPI[]

            return {
                ...json,
                data: data.map(toMajorSelect)
            }
        }
        throw json
    }
}