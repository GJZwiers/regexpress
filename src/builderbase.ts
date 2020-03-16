import { RXData, RXPlaceholder, RXSettings } from './rxtypes';

export interface ITemplateBuildStrategy {
    buildTemplate(template: string) : string;
    buildGroup(group: string[] | string): string;
    substitutePlaceholder(group: string) : string;
}

export class RegexTemplateStrategy implements ITemplateBuildStrategy {
    protected readonly _regexData: RXData;
    protected readonly _settings: RXSettings;
    protected readonly _placeholderData: RXPlaceholder;

    constructor(regexData: RXData, settings: RXSettings, placeholders?: RXPlaceholder) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    public buildTemplate(template: string) : string {
        for (const namedGroup in this._regexData) {
            const builtGroup = this.buildGroup(this._regexData[namedGroup]);
            const subbedGroup = this.substitutePlaceholder(builtGroup);
            template = template.replace(new RegExp(`${namedGroup}(?=\\W)`, 'g'), subbedGroup);
        }
        return template;
    }

    public buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this._settings.separator || '|') : group;
    }

    public substitutePlaceholder(group: string) : string {
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!this._placeholderData[p1]) throw new Error(`undefined placeholder ${match} in regex data`);
            return this.buildGroup(this._placeholderData[p1]);
        });
    }

}

export interface RXField {
    settings: RXSettings
    data: RXData
}

export interface RXJSON {
    [name: string]: RXField
}

export class JSONRegexStrategy implements ITemplateBuildStrategy {
    private readonly _json: RXField;
    private readonly _placeholderData: RXPlaceholder;

    constructor(json: RXField, placeholders?: RXPlaceholder) {
        this._json = json;
        this._placeholderData = placeholders || {};
    }

    public buildTemplate(template: string): string {
        for (const namedGroup in this._json.data) {
            const builtGroup = this.buildGroup(this._json.data[namedGroup]);
            const subbedGroup = this.substitutePlaceholder(builtGroup);
            template = template.replace(new RegExp(`${namedGroup}(?=\\W)`, 'g'), subbedGroup);
        }
        
        return template;
    }

    public buildGroup(group: string[] | string): string {
        return (Array.isArray(group)) ? group.join(this._json.settings.separator || '|') : group;
    }
    
    public substitutePlaceholder(group: string): string {
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!this._placeholderData[p1]) throw new Error(`undefined placeholder ${match} in regex data`);
            return this.buildGroup(this._placeholderData[p1]);
        });
    }

}

interface RXCSV {
    
}

class CSVRegexStrategy implements ITemplateBuildStrategy {
    private readonly _csv: RXCSV;
    private readonly _placeholderData: RXPlaceholder;

    constructor(csv: RXCSV, placeholders?: RXPlaceholder) {
        this._csv = csv;
        this._placeholderData = placeholders || {};
    }

    public buildTemplate(template: string): string {
        throw new Error("Method not implemented.");
    }    

    public buildGroup(group: string | string[]): string {
        throw new Error("Method not implemented.");
    }

    public substitutePlaceholder(group: string): string {
        throw new Error("Method not implemented.");
    }

}




export abstract class RegexTemplateBuilder {
    protected _regexData: RXData;
    protected _settings: RXSettings;
    protected _placeholderData: RXPlaceholder;

    constructor(regexData: RXData, settings: RXSettings, placeholders?: RXPlaceholder) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    protected abstract buildTemplate(template: string) : string;
    protected abstract buildGroup(group: string[] | string) : string;
    protected abstract substitutePlaceholder(group: string) : string;
}