export interface RXData {
    [key: string]: string[] | string
}

export interface RXPlaceholder {
    [key: string]: string[]
}

export interface RXSettingsBase {
    flags: string
    symbol?: string
}

export interface RXSettings extends RXSettingsBase {
    template: string
}

export interface RXListSettings extends RXSettingsBase {
    templateList: string[]
}
