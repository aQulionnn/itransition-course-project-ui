// services/inventoryService.ts
import type { AxiosInstance } from 'axios'
import type { CreateInventoryRequest, Inventory, LatestInventory, TopInventory } from '../interfaces/inventory'

export const getInventoriesByUserId = async (api: AxiosInstance, userId: string) => {
    const { data } = await api.get<Inventory[]>(`/api/users/${userId}/inventories`)
    return data
}

export const getLatestInventories = async (api: AxiosInstance) => {
    const { data } = await api.get<LatestInventory[]>('/api/inventories/latest')
    return data
}

export const getTopInventories = async (api: AxiosInstance) => {
    const { data } = await api.get<TopInventory[]>('/api/inventories/top')
    return data
}

export const createInventory = async (api: AxiosInstance, request: CreateInventoryRequest) => {
    const { data } = await api.post<string>('/api/inventories', request)
    return data
}