import { RegexData, RegexPlaceholder, RegexSettingsBase } from './IRegex';

export abstract class RegexBuilderBase {
    protected _regexData: RegexData;
    protected _settings: RegexSettingsBase;
    protected _placeholderData: RegexPlaceholder;

    constructor(regexData: RegexData, settings: RegexSettingsBase, placeholders?: RegexPlaceholder) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    protected _buildTemplate(template: string) : string {
        for (const namedGroup in this._regexData) {
            const builtGroup = this._buildGroup(this._regexData[namedGroup]);
            const subbedGroup = this._substitutePlaceholder(builtGroup);
            template = template.replace(new RegExp(`${namedGroup}(?=\\W)`, 'g'), subbedGroup);
        }
        
        return template;
    }

    protected _buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this._settings.separator || '|') : group;
    }

    protected _substitutePlaceholder(group: string) : string {
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!this._placeholderData[p1]) throw new Error(`undefined placeholder ${match} in regex data`);
            return this._buildGroup(this._placeholderData[p1]);
        });
    }

}


