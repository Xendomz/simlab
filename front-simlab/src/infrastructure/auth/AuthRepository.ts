import { LoginCredentials, RegisterCredentials } from "../../domain/Auth/Auth";
import { IAuthRepository } from "../../domain/Auth/IAuthRepository";
import { User } from "../../domain/User/User";
import { ApiResponse } from "../../shared/Types";
import { fetchApi } from "../ApiClient";
import { StorageManager } from "../StorageManager";
import { toDomain, UserApi } from "../user/UserApi";
import { LoginResponseAPI } from "./AuthApi";

export class AuthRepository implements IAuthRepository {
    async getCurrentUser(token: string): Promise<User> {
        const response = await fetchApi('/user/me', {
          method: 'GET',
          token
        });

        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as UserApi
            return toDomain(data)
        }

        if (response.status == 401) {
            StorageManager.clear()
        }
        
        throw json
    }
    async login(credentials: LoginCredentials): Promise<User> {
        const response = await fetchApi('/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        
        const json = await response.json() as ApiResponse<LoginResponseAPI>
        if (response.ok) {
            StorageManager.setAccessToken(json.data?.token || '')
            if (json.data?.user) {
                return toDomain(json.data.user);
            }
        } 
        throw json
    }
    async register(credentials: RegisterCredentials): Promise<void> {
        const response = await fetchApi('/register', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });

        const json = await response.json()
        if (response.ok) {
            return 
        }
        throw json
    }

    async logout(): Promise<boolean> {
        const response = await fetchApi('/logout', {
          method: 'POST',
        });

        const json = await response.json() as ApiResponse
        return json.success
    }
   

}