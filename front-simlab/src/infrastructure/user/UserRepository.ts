import { IUserRepository } from "../../domain/User/IUserRepository";
import { User } from "../../domain/User/User";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { toDomain, UserApi } from "./UserApi";
import { userRole } from "@/domain/User/UserRole";
import { generateQueryStringFromObject } from "../Helper";
import { UserSelect } from "@/domain/User/UserSelect";
import { UserSelectAPI, toDomain as toUserSelect } from "./UserSelectAPI";

export class UserRepository implements IUserRepository {
    async getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_study_program?: number,
        role: userRole
    }): Promise<PaginatedResponse<User>> {
        const queryString = generateQueryStringFromObject(params)
        const response = await fetchApi(`/users?${queryString}`, { method: 'GET' });
        const json = await response.json();

        if (response.ok) {
            const data = json['data'] as PaginatedResponse<UserApi>
            return {
                ...data,
                data: data.data.map(toDomain)
            };
        }

        throw json['message'];
    }

    async createData(data: {
        name: string | null,
        email: string | null,
        role: string | null,
        study_program_id: number | null,
        identity_num: string | null,
        password: string | null
    }): Promise<ApiResponse> {
        const response = await fetchApi('/users', {
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
        name: string | null,
        email: string | null,
        role: string | null,
        study_program_id: number | null,
        identity_num: string | null,
        password: string | null
    }): Promise<ApiResponse> {
        const response = await fetchApi(`/users/${id}`, {
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
        const response = await fetchApi(`/users/${id}`, {
            method: 'DELETE',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async restoreToDosen(id: number): Promise<ApiResponse> {
        const response = await fetchApi(`/users/${id}/restore-dosen`, {
            method: 'PUT',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getDataForSelect(role: userRole): Promise<ApiResponse<UserSelect[]>> {
        const response = await fetchApi(`/users/select?role=${role}`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as UserSelectAPI[]
            return {
                ...json,
                data: data.map(toUserSelect)
            }
        }
        throw json
    }
}