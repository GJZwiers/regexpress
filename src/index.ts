export interface RegexSettings
{
    template: string,
    flags: string
}

export interface RegexData
{
    settings: RegexSettings
    [key: string]: any
}

export interface PlaceholderSubstitutes
{
    [key: string]: any
}

export class Regexpress
{
    private _regexData: RegexData = { settings: { template: "empty", flags: ""}, "empty": ["empty"]};
    private _placeholderSubstitutes: PlaceholderSubstitutes = { empty: "empty"};

    constructor(placeholderSubstitutes: object) {
        this._placeholderSubstitutes = placeholderSubstitutes;
    }

    public setPlaceholderSubstitutes(subs: PlaceholderSubstitutes) {
        this._placeholderSubstitutes = subs;
    }

    public buildRegex(regexData: RegexData) {
        this._regexData = regexData;

        this._buildValues();

        return new RegExp(this._buildTemplate(), this._regexData.settings.flags);
    }

    private _buildValues(){
        for (let key in this._regexData){
            if (!Array.isArray(this._regexData[key]))
                continue;
        
            this._regexData[key] = this._joinArrayWithPipeSymbols(this._regexData[key]);
        }

    }

    private _joinArrayWithPipeSymbols(arr: Array<string>) : string {
        return arr.join('|');
    }

    private _buildTemplate() : string {
        if (!this._placeholderSubstitutes)
            return this._substituteTemplateVariables(this._regexData.settings.template);

        return this._substitutePlaceholders(this._substituteTemplateVariables(this._regexData.settings.template));
    }

    private _substituteTemplateVariables(template: string) : string {
        const template_vars = template.match(/\w+/g);

        if (template_vars === null) throw new Error('Regexpress: cannot build regex with 0 template groups');

        for (let template_var of template_vars) {
            if (!this._regexData[template_var]) {
                continue;
            }

            template = template.replace(template_var, this._regexData[template_var]);
        }

        return template;
    }

    private _substitutePlaceholders(regexString: string) : string {
        for (let name in this._placeholderSubstitutes) {
            let substitute = this._placeholderSubstitutes[name];
            regexString = regexString.replace(`~~${name}~~`, substitute.join('|'));
        }

        return regexString;
    }

    private _mapCaptureGroups(template: string) : Array<string> {
        const groups = template.match(/\((\w+?)\)/g);
        let map = [];
        map[0] = 'full_match';

        if (groups === null) return map;
  
        for (let i = 0; i < groups.length; i++){
            let key = groups[i][1];
            map[i + 1] = key;
        }
  
        return map;
    }

}
