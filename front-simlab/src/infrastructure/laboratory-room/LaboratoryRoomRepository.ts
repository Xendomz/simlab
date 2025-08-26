import { LaboratoryRoomInputDTO, LaboratoryRoomParam } from "@/application/laboratory-room/dto/LaboratoryRoomDTO";
import { ILaboratoryRoomRepository } from "../../domain/laboratory-room/ILaboratoryRoomRepository";
import { LaboratoryRoom } from "../../domain/laboratory-room/LaboratoryRoom";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { LaboratoryRoomAPI, toDomain } from "./LaboratoryRoomAPI";

export class LaboratoryRoomRepository implements ILaboratoryRoomRepository {
    async getAll(params: LaboratoryRoomParam): Promise<PaginatedResponse<LaboratoryRoom>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

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

    async createData(data: LaboratoryRoomInputDTO): Promise<ApiResponse<LaboratoryRoom>> {
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

    async updateData(id: number, data: LaboratoryRoomInputDTO): Promise<ApiResponse<LaboratoryRoom>> {
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
}