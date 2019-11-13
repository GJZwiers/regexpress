import { BuilderBase } from "./rjsonbuilder";
import { RegexListData } from "./IRegex";

export class RegexListBuilder extends BuilderBase  {

    buildList(field: RegexListData) : Array<RegExp> {
        this._regexData = field;
        this._template = this._regexData.settings.template;
        this._buildGroups();

        return this._buildRegexes();;
    }

    private _buildRegexes() : Array<RegExp> {
        const list = [];
        for (const template of this._template) {
            list.push(new RegExp(this._substituteTemplateGroups(template),
                this._regexData.settings.flags));
        }
        
        return list;
    }

    private _substituteTemplateGroups(template: string) : string {
        for (const group in this._regexData) {
            template = template.replace(new RegExp(group, 'g'), this._regexData[group]);
        }
        
        return template;
    }

}
