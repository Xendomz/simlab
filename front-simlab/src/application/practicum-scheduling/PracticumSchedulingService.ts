
import { PracticumSchedulingRepository } from "@/infrastructure/practicum-scheduling/PracticumSchedulingRepository";
import { PracticumSchedulingEquipmentNMaterialInputDTO, PracticumSchedulingInputDTO, PracticumSchedulingTableParam, PracticumSchedulingVerifyDTO } from "./dto/PracticumSchedulingDTO";
import { PracticumSchedulingView } from "./PracticumSchedulingView";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { PracticumStepperView } from "./PracticumStepperView";

export class PracticumSchedulingService {
    private readonly practicumSchedulingRepository = new PracticumSchedulingRepository()

    async getPracticumSchedulingData(params: PracticumSchedulingTableParam): Promise<PaginatedResponse<PracticumSchedulingView>> {
        const practicumSchedulings = await this.practicumSchedulingRepository.getAll(params)

        return {
            ...practicumSchedulings,
            data: practicumSchedulings.data.map(PracticumSchedulingView.fromDomain) || []
        }
    }

    async create(data: PracticumSchedulingInputDTO): Promise<ApiResponse<PracticumSchedulingView>> {
        const practicumScheduling = await this.practicumSchedulingRepository.create(data)

        return {
            ...practicumScheduling,
            data: practicumScheduling.data ? PracticumSchedulingView.fromDomain(practicumScheduling.data) : undefined
        }
    }

    async getPracticumSchedulingDetail(id: number): Promise<ApiResponse<PracticumSchedulingView>> {
        const practicumScheduling = await this.practicumSchedulingRepository.getPracticumSchedulingData(id)

        return {
            ...practicumScheduling,
            data: practicumScheduling.data ? PracticumSchedulingView.fromDomain(practicumScheduling.data) : undefined
        }
    }

    async storePracticumSchedulingEquipmentMaterial(id: number, data: PracticumSchedulingEquipmentNMaterialInputDTO): Promise<ApiResponse> {
        const payload = {
            practicumSchedulingEquipments: data.practicumSchedulingEquipments.map(e => ({ id: e.id, quantity: e.quantity })),
            practicumSchedulingMaterials: data.practicumSchedulingMaterials.map(m => ({ id: m.id, quantity: m.quantity })),
        }
        return await this.practicumSchedulingRepository.storePracticumSchedulingEquipmentMaterial(id, payload)
    }

    async verify(id: number, data: PracticumSchedulingVerifyDTO): Promise<ApiResponse> {
        return await this.practicumSchedulingRepository.verify(id, data);
    }

    async getPracticumSchedulingForVerification(params: PracticumSchedulingTableParam): Promise<PaginatedResponse<PracticumSchedulingView>> {
        const practicumSchedulings = await this.practicumSchedulingRepository.getPracticumSchedulingForVerification(params);

        return {
            ...practicumSchedulings,
            data: practicumSchedulings.data.map(PracticumSchedulingView.fromDomain) || []
        }
    }

    async isStillHaveDraftPracticum(): Promise<ApiResponse> {
        return await this.practicumSchedulingRepository.isStillHaveDraftPracticum()
    }

    async getPracticumSteps(id: number): Promise<ApiResponse<PracticumStepperView[]>> {
        const response = await this.practicumSchedulingRepository.getPracticumSteps(id);
        return {
            ...response,
            data: response.data ? response.data.map(PracticumStepperView.fromDomain) : []
        };
    }
}