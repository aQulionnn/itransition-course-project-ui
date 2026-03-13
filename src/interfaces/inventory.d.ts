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