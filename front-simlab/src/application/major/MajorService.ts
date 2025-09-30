import { MajorRepository } from "@/infrastructure/major/MajorReposistory";
import { MajorView } from "./MajorView";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { MajorInputDTO, MajorTableParam } from "./MajorDTO";
import { MajorSelectView } from "./MajorSelectView";

export class MajorService {
    private readonly majorRepository = new MajorRepository()

    async getMajorData(params: MajorTableParam): Promise<PaginatedResponse<MajorView>> {
        const major = await this.majorRepository.getAll(params)

        return {
            ...major,
            data: major.data.map(MajorView.fromDomain) || []
        }
    }

    async createData(data: MajorInputDTO) {
        return await this.majorRepository.createData(data)
    }

    async updateData(id: number, data: MajorInputDTO) {
        return await this.majorRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.majorRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<MajorSelectView[]>> {
        const majors = await this.majorRepository.getDataForSelect()

        return {
            ...majors,
            data: majors.data ? majors.data.map(MajorSelectView.fromDomain) : undefined
        }
    }
}