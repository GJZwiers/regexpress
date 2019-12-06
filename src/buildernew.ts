import { AugmentedExp } from './augmentedExp';

interface Buildable {
    build() : RegExp;
}

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

export class TemplateBuilder extends RegexBuilderBase {

    public build() : AugmentedExp {
        return this._buildRegex(this._buildTemplate(this._settings.template));
    }

    private _buildRegex(template: string) : AugmentedExp {
        return new AugmentedExp(template, this._settings.flags, this._settings.template);
    }

}

export class TemplateListBuilder extends RegexBuilderBase {

    public build() : Array<RegExp> {
        if (!this._settings.templateList) throw new Error('templateList must be defined');
        const regexList: Array<RegExp> = [];
        for (let template of this._settings.templateList) {
            regexList.push(this._buildRegex(this._buildTemplate(template)));
        }
        
        return regexList;
    }

    private _buildRegex(template: string) : RegExp {
        return new RegExp(template, this._settings.flags);
    }

}
