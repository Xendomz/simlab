import { ILaboratoryRoomRepository } from "../../domain/laboratory-room/ILaboratoryRoomRepository";
import { LaboratoryRoom } from "../../domain/laboratory-room/LaboratoryRoom";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { LaboratoryRoomAPI, toDomain } from "./LaboratoryRoomAPI";
import { generateQueryStringFromObject } from "../Helper";
import { LaboratoryRoomSelectAPI, toDomain as toLaboratorySelect } from "./LaboratoryRoomSelectAPI";
import { LaboratoryRoomSelect } from "@/domain/laboratory-room/LaboratoryRoomSelect";

export class LaboratoryRoomRepository implements ILaboratoryRoomRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<LaboratoryRoom>> {
        const queryString = generateQueryStringFromObject(params)
        const response = await fetchApi(`/laboratory-rooms?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<LaboratoryRoomAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }

        throw json['message'];
    }

    async createData(data: {
        name: string,
        floor: string,
        user_id: number | null,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse<LaboratoryRoom>> {
        const response = await fetchApi('/laboratory-rooms', {
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
        name: string,
        floor: string,
        user_id: number | null,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse<LaboratoryRoom>> {
        const response = await fetchApi(`/laboratory-rooms/${id}`, {
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
        const response = await fetchApi(`/laboratory-rooms/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getDataForSelect(): Promise<ApiResponse<LaboratoryRoomSelect[]>> {
        const response = await fetchApi(`/laboratory-rooms/select`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as LaboratoryRoomSelectAPI[]

            return {
                ...json,
                data: data.map(toLaboratorySelect)
            }
        }
        throw json
    }
}