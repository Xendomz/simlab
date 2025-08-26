import { StudyProgramInputDTO, StudyProgramTableParam } from "../../application/study-program/dto/StudyProgramDTO";
import { IStudyProgramRepository } from "../../domain/study-program/IStudyProgramRepository";
import { StudyProgram } from "../../domain/study-program/StudyProgram";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { StudyProgramAPI, toDomain } from "./StudyProgramAPI";

export class StudyProgramRepository implements IStudyProgramRepository {
    async getAll(params: StudyProgramTableParam): Promise<PaginatedResponse<StudyProgram>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

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

    async createData(data: StudyProgramInputDTO): Promise<ApiResponse> {
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

    async updateData(id: number, data: StudyProgramInputDTO): Promise<ApiResponse> {
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
}