export type ElementType =
    | 'FixedText'
    | 'Random20Bit'
    | 'Random32Bit'
    | 'Random6Digit'
    | 'Random9Digit'
    | 'Guid'
    | 'DateTime'
    | 'Sequence'

export interface IdElement {
    id: string
    type: ElementType
    order: number
    text?: string
    padding: number
    dateFormat?: string
}

export interface IdFormat {
    formatId: string | null
    elements: IdElement[]
    preview: string
}

export interface SaveIdFormatRequest {
    elements: SaveIdElementRequest[]
}

export interface SaveIdElementRequest {
    type: ElementType
    text?: string
    padding: number
    dateFormat?: string
}