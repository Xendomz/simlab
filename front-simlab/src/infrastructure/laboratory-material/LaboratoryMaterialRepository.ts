import { LaboratoryMaterialInputDTO, LaboratoryMaterialTableParams } from "@/application/laboratory-material/dto/LaboratoryMaterialDTO";
import { ILaboratoryMaterialRepository } from "../../domain/laboratory-material/ILaboratoryMaterialRepository";
import { LaboratoryMaterial } from "../../domain/laboratory-material/LaboratoryMaterial";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { LaboratoryMaterialAPI, toDomain } from "./LaboratoryMaterialAPI";

export class LaboratoryMaterialRepository implements ILaboratoryMaterialRepository {
    async getAll(params: LaboratoryMaterialTableParams): Promise<PaginatedResponse<LaboratoryMaterial>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/laboratory-materials?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<LaboratoryMaterialAPI>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            }
        }
        throw json['message'];
    }

    async createData(data: LaboratoryMaterialInputDTO): Promise<ApiResponse> {
        const response = await fetchApi('/laboratory-materials', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: LaboratoryMaterialInputDTO): Promise<ApiResponse> {
        const response = await fetchApi(`/laboratory-materials/${id}`, {
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
        const response = await fetchApi(`/laboratory-materials/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}