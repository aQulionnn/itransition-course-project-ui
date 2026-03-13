import type { AxiosInstance } from 'axios'
import type { Tag } from '../interfaces/tag'

export const getTags = async (api: AxiosInstance) => {
    const { data } = await api.get<Tag[]>('/api/tags')
    return data
}