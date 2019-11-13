import { RegexData, RegexListData} from './IRegex';

export abstract class BuilderBase {
    protected _regexData: RegexData | RegexListData = { settings: { template: 'values', flags: '' }, values: ''};
    protected _symbol: string;
    protected _template = this._regexData.settings.template;
    protected _templates: Array<string> = [];

    constructor(symbol: string = '|') {
        this._symbol = symbol;
    }

    getTemplate() {
        return this._template;
    }

    protected _buildGroup(group: Array<string>) : string {
        if (!Array.isArray(group)) return group;
        return group.join(this._symbol);
    }

    protected _buildGroups() : void {
        for (const group in this._regexData) {
            this._regexData[group] = this._buildGroup(this._regexData[group]);
        }
    }
}

export class RegexJSONBuilder extends BuilderBase {

    build(field: RegexData) : RegExp {
        this._regexData = field;
        this._template = this._regexData.settings.template;
        this._buildGroups();
        
        return this._buildRegex();
    }

    private _buildRegex() : RegExp {
        return new RegExp(this._substituteTemplateGroups(), this._regexData.settings.flags);
    }

    private _substituteTemplateGroups() : string {
        let template = this._template;
        if (Array.isArray(template)) return template[0];
        
        for (const group in this._regexData) {
            template = template.replace(group, this._regexData[group]);
        }
        
        return template;
    }

}
