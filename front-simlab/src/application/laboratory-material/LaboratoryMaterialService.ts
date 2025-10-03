import { LaboratoryMaterialRepository } from "@/infrastructure/laboratory-material/LaboratoryMaterialRepository";
import { LaboratoryMaterialInputDTO, LaboratoryMaterialTableParams } from "./LaboratoryMaterialDTO";
import { PaginatedResponse } from "@/shared/Types";
import { LaboratoryMaterialView } from "./LaboratoryMaterialView";

export class LaboratoryMaterialService {
    private readonly laboratoryMaterialRepository = new LaboratoryMaterialRepository()

    async getLaboratoryMaterialData(params: LaboratoryMaterialTableParams): Promise<PaginatedResponse<LaboratoryMaterialView>> {
        const laboratoryMaterial = await this.laboratoryMaterialRepository.getAll(params)
        
        return {
            ...laboratoryMaterial,
            data: laboratoryMaterial.data.map(LaboratoryMaterialView.fromDomain)
        }
    }

    async createData(data: LaboratoryMaterialInputDTO) {
        return await this.laboratoryMaterialRepository.createData(data)
    }

    async updateData(id: number, data: LaboratoryMaterialInputDTO) {
        return await this.laboratoryMaterialRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.laboratoryMaterialRepository.deleteData(id)
    }
}