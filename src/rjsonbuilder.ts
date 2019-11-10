interface RegexSettings
{
    template: string,
    flags: string
}

interface RegexData
{
    settings: RegexSettings
    [key: string]: any
}

interface PlaceholderSubstitutes
{
    [key: string]: any
}
// TemplateWorker

// TemplateGroups as tokens (interpreter pattern
// class TemplateParser)
export class RegexJSONBuilder {
    private _regexData: RegexData = { settings: { template: 'values', flags: '' }, values: ''};
    private _template = this._regexData.settings.template;

    constructor() {}

    getTemplate() {
        return this._template;
    }

    build(field: RegexData) : RegExp {
        this._regexData = this.deepCopy(field);
        this._template = this._regexData.settings.template;
        this._buildGroups();
        const regex = this._buildTemplate();

        return new RegExp(regex, this._regexData.settings.flags);
    }

    deepCopy(field: RegexData) : RegexData {
        return JSON.parse(JSON.stringify(field));
    }

    private _buildGroups() : void {
        for (const group in this._regexData) {
            if (!Array.isArray(this._regexData[group])) continue;
            this._regexData[group] = this._regexData[group].join('|');
        }
    }

    private _buildTemplate() : string {
        return this._substituteTemplateGroups();
    }

    private _substituteTemplateGroups() : string {
        let template = this._template;
        for (const group in this._regexData) {
            template = template.replace(group, this._regexData[group]);
        }
        
        return template;
    }

}


