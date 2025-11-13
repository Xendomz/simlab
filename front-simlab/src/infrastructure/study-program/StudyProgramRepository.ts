import { StudyProgramSelect } from "@/domain/study-program/StudyProgramSelect";
import { IStudyProgramRepository } from "../../domain/study-program/IStudyProgramRepository";
import { StudyProgram } from "../../domain/study-program/StudyProgram";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { generateQueryStringFromObject } from "../Helper";
import { StudyProgramAPI, toDomain } from "./StudyProgramAPI";
import { StudyProgramSelectAPI, toDomain as toStudyProgramSelect } from "./StudyProgramSelectAPI";

export class StudyProgramRepository implements IStudyProgramRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_major?: number
    }): Promise<PaginatedResponse<StudyProgram>> {
        const queryString = generateQueryStringFromObject(params)
        const response = await fetchApi(`/study-programs?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<StudyProgramAPI>

            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }

        throw json['message'];
    }

    async createData(data: {
        major_id: number | null,
        name: string,
    }): Promise<ApiResponse> {
        const response = await fetchApi('/study-programs', {
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
        major_id: number | null,
        name: string,
    }): Promise<ApiResponse> {
        const response = await fetchApi(`/study-programs/${id}`, {
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
        const response = await fetchApi(`/study-programs/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getPublicData(): Promise<ApiResponse<StudyProgram[]>> {
        const response = await fetchApi(`/pub/study-programs`, { method: 'GET' });
        const json = await response.json() as ApiResponse<StudyProgramAPI[]>;

        if (!response.ok) {
            throw json['message'];
        }

        return {
            ...json,
            data: json.data?.map(toDomain)
        };
    }

    async getDataForSelect(): Promise<ApiResponse<StudyProgramSelect[]>> {
        const response = await fetchApi(`/study-programs/select`, { method: 'GET' });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as StudyProgramSelectAPI[]
            return {
                ...json,
                data: data.map(toStudyProgramSelect)
            }
        }
        throw json
    }
}