export interface RegexSettings {
    template: string;
    flags: string;
}
export interface RegexData {
    settings: RegexSettings;
    [key: string]: any;
}
export interface PlaceholderSubstitutes {
    [key: string]: any;
}
export declare class Regexpress {
    private _regexData;
    private _placeholderSubstitutes;
    constructor(placeholderSubstitutes: PlaceholderSubstitutes);
    setPlaceholderSubstitutes(subs: PlaceholderSubstitutes): void;
    buildRegex(regexData: RegexData): RegExp;
    private _buildValues;
    private _joinArrayWithPipeSymbols;
    private _buildTemplate;
    private _substituteTemplateVariables;
    private _substitutePlaceholders;
    private _mapCaptureGroups;
}
