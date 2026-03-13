import { client } from '../api/client'
import type { Category } from '../interfaces/category'

export const categoryService = {
    getAll: () => client.get<Category[]>('/api/categories').then(r => r.data)
}