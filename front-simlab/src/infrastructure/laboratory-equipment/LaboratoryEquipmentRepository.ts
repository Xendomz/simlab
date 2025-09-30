import { ILaboratoryEquipmentRepository } from "../../domain/laboratory-equipment/ILaboratoryEquipmentRepository";
import { LaboratoryEquipment } from "../../domain/laboratory-equipment/LaboratoryEquipment";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { LaboratoryEquipmentAPI, toDomain } from "./LaboratoryEquipmentAPI";
import { generateQueryStringFromObject } from "../Helper";

export class LaboratoryEquipmentRepository implements ILaboratoryEquipmentRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_laboratory_room?: number,
    }): Promise<PaginatedResponse<LaboratoryEquipment>> {
        const queryString = generateQueryStringFromObject(params)

        const response = await fetchApi(`/laboratory-equipments?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<LaboratoryEquipmentAPI>
            return {
                ...data,
                data: data.data.map(toDomain)
            }
        }
        throw json['message'];
    }

    async createData(data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'POST')
        const response = await fetchApi('/laboratory-equipments', {
            method: 'POST',
            body: bodyFormData,
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: {
        equipment_name: string;
        laboratory_room_id: number;
        quantity: number;
        unit: string;
        function: string;
        photo: string | File | null;
        brand: string;
        equipment_type: string;
        origin: string;
        condition: string;
        condition_description: string;
        asset_code: string
    }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'PUT')
        const response = await fetchApi(`/laboratory-equipments/${id}`, {
            method: 'POST',
            body: bodyFormData,
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/laboratory-equipments/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
}