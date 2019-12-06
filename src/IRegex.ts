export interface RXData {
    [key: string]: string[] | string
}

export interface RXPlaceholder {
    [key: string]: string[]
}

export interface RXSettings {
    template: string
    flags: string
    symbol?: string
    templateList?: string[]
}

