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

export class RegexBuilder
{
    private _regexData: RegexData;
    private _placeholderSubstitutes: PlaceholderSubstitutes;

    constructor(regexData: RegexData, placeholderSubstitutes: PlaceholderSubstitutes) {
        this._regexData = regexData;
        this._placeholderSubstitutes = placeholderSubstitutes;
    }

    public setPlaceholderSubstitutes(subs: PlaceholderSubstitutes){
        this._placeholderSubstitutes = subs;
    }

    public buildRegex(regexData: RegexData){
        this._regexData = regexData;

        this._buildValues();

        return new RegExp(this._buildTemplate() , this._regexData.settings.flags);
    }

    private _buildValues(){
        for (let key in this._regexData){
            if (!Array.isArray(this._regexData[key]))
                return;
        
            this._regexData[key] = this._joinArrayWithPipeSymbols(this._regexData[key]);
        }

        // this._regexData.forEach((group: any, key: string) => {
        //     if (!Array.isArray(group))
        //         return;
            
        //     this._regexData[key] = this._joinArrayWithPipeSymbols(group);
        // });
    }

    private _joinArrayWithPipeSymbols(arr: Array<string>) : string {
        return arr.join('|');
    }

    private _buildTemplate() : string {
        if (!this._placeholderSubstitutes)
            return this._substituteTemplateVariables(this._regexData.settings.template);

        return this._substitutePlaceholders(this._substituteTemplateVariables(this._regexData.settings.template));
    }

    private _substituteTemplateVariables(template: string) : any {
        const template_vars = template.match('/\w+/g');

        if (template_vars === null) return new Error();

        for (let template_var of template_vars) {
            if (!this._regexData.template_var)
                continue;
            
            template = template.replace(template_var, this._regexData.template_var);
        }

        return template;
    }

    private _substitutePlaceholders(regexString: string) : string {

        for (let placeholder in this._placeholderSubstitutes) {
            let substitute = this._placeholderSubstitutes[placeholder];
            regexString = regexString.replace(`~~${placeholder}~~`, substitute.join('|'));
        }
        // this._placeholderSubstitutes.forEach((substitute: Array<string>, placeholder: string) => {
        //     regexString = regexString.replace(`~~${placeholder}~~`, substitute.join('|'));
        // });

        return regexString;
    }

    private _mapCaptureGroups(template: string) : Array<string> {
        const groups = template.match('/\((\w+?)\)/g');
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