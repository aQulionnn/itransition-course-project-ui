import type { AxiosInstance } from 'axios'
import type { IdFormat, SaveIdFormatRequest } from '../interfaces/idFormat'

export const getIdFormat = async (api: AxiosInstance, inventoryId: string) => {
    const { data } = await api.get<IdFormat>(`/api/inventories/${inventoryId}/id-format`)
    return data
}

export const saveIdFormat = async (api: AxiosInstance, inventoryId: string, request: SaveIdFormatRequest) => {
    await api.put(`/api/inventories/${inventoryId}/id-format`, request)
}