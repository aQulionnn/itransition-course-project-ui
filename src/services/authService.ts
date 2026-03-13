import type { AxiosInstance } from 'axios'
import type { User } from '../interfaces/user'

export const getMe = async (api: AxiosInstance) => {
    const { data } = await api.get<User>('/api/auth/me')
    return data
}

export const login = async (api: AxiosInstance, request: LoginRequest) => {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>('/api/auth/login', request)
    sessionStorage.setItem('accessToken', data.accessToken)
    return data
}

export const register = async (api: AxiosInstance, request: RegisterRequest) => {
    await api.post('/api/auth/register', request)
}

export const logout = () => {
    sessionStorage.removeItem('accessToken')
}