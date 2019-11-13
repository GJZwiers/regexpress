export interface RegexSettings {
    template: string
    flags: string
}

export interface RegexData {
    settings: RegexSettings,
    [key: string]: any
}

export interface RegexListSettings {
    template: Array<string>
    flags: string
}

export interface RegexListData {
    settings: RegexListSettings
    [key: string]: any
}