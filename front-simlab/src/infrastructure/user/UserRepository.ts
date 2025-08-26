import { UserInputDTO, UserTableParams } from "@/application/user/dto/UserDTO";
import { IUserRepository } from "../../domain/User/IUserRepository";
import { User } from "../../domain/User/User";
import { ApiResponse, PaginatedResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { toDomain, UserApi } from "./UserApi";

export class UserRepository implements IUserRepository {
    async getAll(params: UserTableParams): Promise<PaginatedResponse<User>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

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

    async createData(data: UserInputDTO): Promise<ApiResponse> {
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

    async updateData(id: number, data: UserInputDTO): Promise<ApiResponse> {
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
}