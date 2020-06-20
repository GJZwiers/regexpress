export interface RegexData {
    [key: string]: string[] | string
}

export interface RegexPlaceholder {
    [key: string]: string[]
}

export interface RegexSettingsBase {
    flags: string
    separator?: string
    autosort?: boolean
}

export interface RegexSettings extends RegexSettingsBase {
    template: string
}

export interface RegexListSettings extends RegexSettingsBase {
    templateList: string[]
}
