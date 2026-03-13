import type { AxiosInstance } from 'axios'
import type { Item, CreateItemRequest, UpdateItemRequest } from '../interfaces/item'

const base = (inventoryId: string) => `/api/inventories/${inventoryId}/items`

export const getItems = async (api: AxiosInstance, inventoryId: string) => {
    const { data } = await api.get<Item[]>(base(inventoryId))
    return data
}

export const createItem = async (api: AxiosInstance, inventoryId: string, request: CreateItemRequest) => {
    const { data } = await api.post<string>(base(inventoryId), request)
    return data
}

export const updateItem = async (api: AxiosInstance, inventoryId: string, itemId: string, request: UpdateItemRequest) => {
    await api.put(`${base(inventoryId)}/${itemId}`, request)
}

export const deleteItem = async (api: AxiosInstance, inventoryId: string, itemId: string) => {
    await api.delete(`${base(inventoryId)}/${itemId}`)
}