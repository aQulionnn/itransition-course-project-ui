export type FieldType = 'Text' | 'MultilineText' | 'Number' | 'Link' | 'Boolean'

export interface InventoryField {
    id: string
    title: string
    description: string
    type: FieldType
    isDisplayed: boolean
}

export interface AddInventoryFieldRequest {
    title: string
    description: string
    type: FieldType
    isDisplayed: boolean
}

export interface UpdateInventoryFieldRequest {
    title: string
    description: string
    isDisplayed: boolean
}