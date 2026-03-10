export interface User {
    id: string
    email: string
    userName: string
    isBlocked: boolean
    isAdmin: boolean
    roles: string[]
}