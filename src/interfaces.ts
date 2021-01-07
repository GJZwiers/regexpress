interface RegexData {
    [key: string]: string[] | string
}

interface RegexPlaceholders {
    [key: string]: string[]
}

interface RegexSettingsBase {
    flags: string
    template: string | string[]
}

interface RegexSettings extends RegexSettingsBase {
    autosort?: boolean
    separator?: string
}

interface ExtraSetting extends RegexSettings {
    degrade: boolean
}

interface RegexSetting<T> {
    [key: string]: T
}

export { RegexData, RegexPlaceholders, RegexSettings, RegexSettingsBase, ExtraSetting }