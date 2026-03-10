import { client } from '../api/client'
import type { User } from '../interfaces/user'

export const authService = {
    getMe: () => client.get<User>('/api/auth/me').then(r => r.data),

    logout: () => client.post('/api/auth/logout'),

    loginWithGoogle: () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google-login?returnUrl=http://localhost:5173`
    }
}