import { client } from '../api/client'
import type { Inventory } from '../interfaces/inventory'

export const inventoryService = {
    getByUserId: (userId: string) =>
        client.get<Inventory[]>(`/api/users/${userId}/inventories`).then(r => r.data)
}