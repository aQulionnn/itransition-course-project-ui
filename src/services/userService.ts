import { client } from '../api/client'
import type { User } from '../interfaces/user'

export const userService = {
    getAll: () => client.get<User[]>('/api/users').then(r => r.data),
    block: (ids: string[]) => client.patch('/api/users/block', ids),
    unblock: (ids: string[]) => client.patch('/api/users/unblock', ids),
    delete: (ids: string[]) => client.delete('/api/users', { data: ids }),
    makeAdmins: (ids: string[]) => client.patch('/api/users/make-admins', ids),
    removeAdmins: (ids: string[]) => client.patch('/api/users/remove-admins', ids),
}