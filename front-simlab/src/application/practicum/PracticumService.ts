import { PracticumRepository } from "@/infrastructure/practicum/PracticumRepository";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumView } from "./PracticumView";
import { PracticumInputDTO, PracticumTableParam } from "./PracticumDTO";
import { PracticumSelectView } from "./PracticumSelectView";

export class PracticumService {
    private readonly practicumRepository = new PracticumRepository()

    async getPracticalWorkData(params: PracticumTableParam): Promise<PaginatedResponse<PracticumView>> {
        const practicums = await this.practicumRepository.getAll(params)
        
        return {
            ...practicums,
            data: practicums.data.map(PracticumView.fromDomain)
        }
    }

    async createData(data: PracticumInputDTO) {
        return await this.practicumRepository.createData(data)
    }

    async updateData(id: number, data: PracticumInputDTO) {
        return await this.practicumRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.practicumRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<PracticumSelectView[]>> {
        const practicums = await this.practicumRepository.getDataForSelect()

        return {
            ...practicums,
            data: practicums.data ? practicums.data.map(PracticumSelectView.fromDomain) : undefined
        }
    }
}