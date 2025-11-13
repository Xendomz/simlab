import { FacultyRepository } from "@/infrastructure/faculty/FacultyRepository";
import { FacultyInputDTO, FacultyTableParam } from "./FacultyDTO";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { FacultyView } from "./FacultyView";
import { FacultySelectView } from "./FacultySelectView";

export class FacultyService {
    private readonly facultyRepository = new FacultyRepository()

    async getFacultyData(params: FacultyTableParam): Promise<PaginatedResponse<FacultyView>> {
        const faculties = await this.facultyRepository.getAll(params)

        return {
            ...faculties,
            data: faculties.data.map(FacultyView.fromDomain)
        }
    }

    async createData(data: FacultyInputDTO): Promise<ApiResponse<FacultyView>> {
        const faculty = await this.facultyRepository.createData(data)

        return {
            ...faculty,
            data: faculty.data ? FacultyView.fromDomain(faculty.data) : undefined
        }
    }

    async updateData(id: number, data: FacultyInputDTO): Promise<ApiResponse<FacultyView>> {
        const faculty = await this.facultyRepository.updateData(id, data)

        return {
            ...faculty,
            data: faculty.data ? FacultyView.fromDomain(faculty.data) : undefined
        }
    }

    async deleteData(id: number) {
        return await this.facultyRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<FacultySelectView[]>> {
        const faculties = await this.facultyRepository.getDataForSelect()

        return {
            ...faculties,
            data: faculties.data ? faculties.data.map(FacultySelectView.fromDomain) : undefined
        }
    }
}