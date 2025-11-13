import { LaboratoryEquipmentRepository } from "@/infrastructure/laboratory-equipment/LaboratoryEquipmentRepository";
import { LaboratoryEquipmentInputDTO, LaboratoryEquipmentTableParams } from "./LaboratoryEquipmentDTO";
import { PaginatedResponse } from "@/shared/Types";
import { LaboratoryEquipmentView } from "./LaboratoryEquipmentView";

export class LaboratoryEquipmentService {
    private laboratoryEquipmentRepository = new LaboratoryEquipmentRepository()

    async getLaboratoryEquipmentData(params: LaboratoryEquipmentTableParams): Promise<PaginatedResponse<LaboratoryEquipmentView>> {
        const laboratoryEquipment = await this.laboratoryEquipmentRepository.getAll(params)

        return {
            ...laboratoryEquipment,
            data: laboratoryEquipment.data.map(LaboratoryEquipmentView.fromDomain)
        }
    }

    async createData(data: LaboratoryEquipmentInputDTO) {
        return await this.laboratoryEquipmentRepository.createData(data)
    }

    async updateData(id: number, data: LaboratoryEquipmentInputDTO) {
        return await this.laboratoryEquipmentRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.laboratoryEquipmentRepository.deleteData(id)
    }
}