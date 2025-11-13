import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { AcademicYearView } from "./AcademicYearView";
import { AcademicYearInputDTO, AcademicYearTableParam } from "./AcademicYearDTO";
import { AcademicYearRepository } from "@/infrastructure/academic-year/AcademicYearRepository";

export class AcademicYearService {
    private readonly academicYearRepository = new AcademicYearRepository()

    async getAcademicYearData(params: AcademicYearTableParam): Promise<PaginatedResponse<AcademicYearView>> {
        const academicYear = await this.academicYearRepository.getAll(params)

        return {
            ...academicYear,
            data: academicYear.data.map(AcademicYearView.fromDomain) || []
        };
    }

    async createData(data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYearView>> {
        const academicYear = await this.academicYearRepository.createData(data)

        return {
            ...academicYear,
            data: academicYear.data ? AcademicYearView.fromDomain(academicYear.data) : undefined
        }
    }

    async updateData(id: number, data: AcademicYearInputDTO): Promise<ApiResponse<AcademicYearView>> {
        const academicYear = await this.academicYearRepository.updateData(id, data)

        return {
            ...academicYear,
            data: academicYear.data ? AcademicYearView.fromDomain(academicYear.data) : undefined
        }
    }

    async toggleStatus(id: number): Promise<ApiResponse<AcademicYearView>> {
        const academicYear = await this.academicYearRepository.toggleStatus(id);

        return {
            ...academicYear,
            data: academicYear.data ? AcademicYearView.fromDomain(academicYear.data) : undefined
        }
    }

    async deleteData(id: number) {
        return await this.academicYearRepository.deleteData(id)
    }


}