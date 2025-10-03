import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRepository } from "../../infrastructure/auth/AuthRepository";
import { LoginCredentials, RegisterCredentials } from "../../domain/Auth/Auth";
import { StorageManager } from "../../infrastructure/StorageManager";
import LoadingPage from "@/presentation/components/LoadingPage";
import { UserView } from "../user/UserView";

interface AuthContextType {
    user: UserView | null,
    token: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProps = {
    children: React.ReactNode
}
const authRepository: AuthRepository = new AuthRepository();

export const AuthProvider = ({ children }: AuthProps) => {
    const [user, setUser] = useState<UserView | null>(null)
    const [token, setToken] = useState<string | null>(StorageManager.getAccessToken())
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initialAuth = async () => {
            try {
                const user = await authRepository.getCurrentUser(token || '')
                setUser(UserView.fromDomain(user))
            } catch (error: any) {
                if (error.code === 401 && !location.pathname.startsWith('/login')) {
                    navigate('/login')
                }
            } finally {
                setLoading(false)
            }
        }

        initialAuth();
    }, [])

    const login = async (credentials: LoginCredentials) => {
        const response = await authRepository.login(credentials);
        setUser(response)
    }

    const register = async (credentials: RegisterCredentials): Promise<void> => {
        await authRepository.register(credentials)
    }

    const logout = async () => {
        const logout = await authRepository.logout();
        if (logout) {
            setToken(null)
            setUser(null)
            StorageManager.clear()
            navigate('/login')
        }
    }

    if (loading) {
        return <LoadingPage />
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}