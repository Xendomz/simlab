import { ITestingTypeRepository } from "../../domain/testing-type/ITestingTypeRepository";
import { TestingType } from "../../domain/testing-type/TestingType";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { generateQueryStringFromObject } from "../Helper";
import { TestingTypeApi, toDomain } from "./TestingTypeApi";

export class TestingTypeRepository implements ITestingTypeRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
    }): Promise<PaginatedResponse<TestingType>> {
        const queryString = generateQueryStringFromObject(params)

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

    async createData(data: {
        name: string,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse> {
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

    async updateData(id: number, data: {
        name: string,
        student_price: number | null,
        lecturer_price: number | null,
        external_price: number | null
    }): Promise<ApiResponse> {
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