import type { InventoryField } from './inventoryField'

export interface Inventory {
    id: string
    title: string
    description: string
    imageUrl: string
    isPublic: boolean
    categoryName: string
    itemsCount: number
    tags: string[]
}

export interface InventoryDetail {
    id: string
    title: string
    description: string
    imageUrl: string
    isPublic: boolean
    creatorId: string
    creatorName: string
    categoryName: string
    itemsCount: number
    tags: string[]
    fields: InventoryField[]
}

export interface LatestInventory {
    id: string
    title: string
    description: string
    imageUrl: string
    creatorName: string
    creatorId: string
    categoryName: string
}

export interface TopInventory {
    id: string
    title: string
    creatorName: string
    creatorId: string
    itemsCount: number
}

export interface CreateInventoryRequest {
    title: string
    description: string
    imageUrl: string
    isPublic: boolean
    categoryId: string
    tags: string[]
}

export interface UpdateInventoryRequest {
    title: string
    description: string
    imageUrl: string
    isPublic: boolean
    categoryId: string
}