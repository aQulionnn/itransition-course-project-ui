import type { AxiosInstance } from 'axios'
import type { InventoryField, AddInventoryFieldRequest, UpdateInventoryFieldRequest } from '../interfaces/inventoryField'

const base = (inventoryId: string) => `/api/inventories/${inventoryId}/fields`

export const getInventoryFields = async (api: AxiosInstance, inventoryId: string) => {
    const { data } = await api.get<InventoryField[]>(base(inventoryId))
    return data
}

export const addInventoryField = async (api: AxiosInstance, inventoryId: string, request: AddInventoryFieldRequest) => {
    const { data } = await api.post<string>(base(inventoryId), request)
    return data
}

export const updateInventoryField = async (api: AxiosInstance, inventoryId: string, fieldId: string, request: UpdateInventoryFieldRequest) => {
    await api.put(`${base(inventoryId)}/${fieldId}`, request)
}

export const deleteInventoryField = async (api: AxiosInstance, inventoryId: string, fieldId: string) => {
    await api.delete(`${base(inventoryId)}/${fieldId}`)
}