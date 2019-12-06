import { RXData, RXSettings, RXPlaceholder } from './IRegex';

export class RegexBuilderBase {
    protected _regexData: RXData;
    protected _settings: RXSettings;
    protected _placeholderData: RXPlaceholder ;

    constructor(regexData: RXData, settings: RXSettings, placeholders?: RXPlaceholder) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    protected _buildTemplate(template: string) : string {
        for (const namedGroup in this._regexData) {
            let builtGroup = this._buildGroup(this._regexData[namedGroup]);
            let subbedGroup = this._substitutePlaceholder(builtGroup);
            template = template.replace(new RegExp(`${namedGroup}(?=\\W)`, 'g'), subbedGroup);
        }
        
        return template;
    }

    protected _buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this._settings.symbol || '|') : group;
    }

    protected _substitutePlaceholder(group: string) : string {
        const thisRef = this;
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!thisRef._placeholderData[p1]) throw new Error(`found undefined placeholder ${match} in regex data`);
            return thisRef._buildGroup(thisRef._placeholderData[p1]);
        });
    }

}