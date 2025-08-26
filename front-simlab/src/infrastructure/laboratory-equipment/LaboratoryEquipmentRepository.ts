import { LaboratoryEquipmentInputDTO, LaboratoryEquipmentTableParams } from "@/application/laboratory-equipment/dto/LaboratoryEquipmentDTO";
import { ILaboratoryEquipmentRepository } from "../../domain/laboratory-equipment/ILaboratoryEquipmentRepository";
import { LaboratoryEquipment } from "../../domain/laboratory-equipment/LaboratoryEquipment";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { LaboratoryEquipmentAPI, toDomain } from "./LaboratoryEquipmentAPI";

export class LaboratoryEquipmentRepository implements ILaboratoryEquipmentRepository {
    async getAll(params: LaboratoryEquipmentTableParams): Promise<PaginatedResponse<LaboratoryEquipment>> {
            const queryString = new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {} as Record<string, string>)
            ).toString();
    
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
    
        async createData(data: LaboratoryEquipmentInputDTO): Promise<ApiResponse> {
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
    
        async updateData(id: number, data: LaboratoryEquipmentInputDTO): Promise<ApiResponse> {
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