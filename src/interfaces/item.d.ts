export interface FieldValue {
    fieldId: string
    fieldTitle: string
    value: string
    isDisplayed: boolean
}

export interface Item {
    id: string
    customId: string
    creatorName: string
    createdOnUtc: string
    fieldValues: FieldValue[]
}

export interface CreateItemRequest {
    customId: string
    fieldValues: { fieldId: string; value: string }[]
}

export interface UpdateItemRequest {
    customId: string
    fieldValues: { fieldId: string; value: string }[]
}