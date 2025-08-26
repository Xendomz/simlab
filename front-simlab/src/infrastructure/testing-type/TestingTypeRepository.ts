import { TestingTypeInputDTO, TestingTypeTableParam } from "../../application/testing-type/dtos/TestingTypeDTO";
import { ITestingTypeRepository } from "../../domain/testing-type/ITestingTypeRepository";
import { TestingType } from "../../domain/testing-type/TestingType";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { TestingTypeApi, toDomain } from "./TestingTypeApi";

export class TestingTypeRepository implements ITestingTypeRepository {
    async getAll(params: TestingTypeTableParam): Promise<PaginatedResponse<TestingType>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/testing-types?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<TestingTypeApi>
            return {
                ...data,
                data: data?.data?.map(toDomain) || []
            };
        }
        throw json['message'];

    }

    async createData(data: TestingTypeInputDTO): Promise<ApiResponse> {
        const response = await fetchApi('/testing-types', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async updateData(id: number, data: TestingTypeInputDTO): Promise<ApiResponse> {
        const response = await fetchApi(`/testing-types/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }
    async deleteData(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/testing-types/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

}