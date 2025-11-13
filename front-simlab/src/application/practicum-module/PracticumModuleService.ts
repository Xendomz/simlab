import { PracticumModuleRepository } from "@/infrastructure/practicum-module/PracticumModuleRepository";
import { PracticumModuleInputDTO, PracticumModuleTableParams } from "./PracticumModuleDTO";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumModuleView } from "./PracticumModuleView";

export class PracticumModuleService {
    private readonly practicumModuleRepository = new PracticumModuleRepository()

    async getPracticumModuleData(params: PracticumModuleTableParams): Promise<PaginatedResponse<PracticumModuleView>> {
        const practicumModules = await this.practicumModuleRepository.getAll(params)

        return {
            ...practicumModules,
            data: practicumModules.data.map(PracticumModuleView.fromDomain) || []
        }
    }

    async createData(data: PracticumModuleInputDTO): Promise<ApiResponse<PracticumModuleView>> {
        const practicumModule = await this.practicumModuleRepository.createData(data)

        return {
            ...practicumModule,
            data: practicumModule.data ? PracticumModuleView.fromDomain(practicumModule.data) : undefined
        }
    }

    async updateData(id: number, data: PracticumModuleInputDTO): Promise<ApiResponse<PracticumModuleView>> {
        const practicumModule = await this.practicumModuleRepository.updateData(id, data)

        return {
            ...practicumModule,
            data: practicumModule.data ? PracticumModuleView.fromDomain(practicumModule.data) : undefined
        }
    }

    async toggleStatus(id: number): Promise<ApiResponse<PracticumModuleView>> {
        const practicumModule = await this.practicumModuleRepository.toggleStatus(id)

        return {
            ...practicumModule,
            data: practicumModule.data ? PracticumModuleView.fromDomain(practicumModule.data) : undefined
        }
    }

    async deleteData(id: number): Promise<ApiResponse> {
        return await this.practicumModuleRepository.deleteData(id)
    }
}