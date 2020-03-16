import { AugmentedExp } from './augmentedExp';
import { RegexTemplateStrategy } from './builderbase';
import { RXSingle, RXList } from './rxtypes';

export class TemplateBuilder extends RegexTemplateStrategy {

    build() : AugmentedExp {
        if ('template' in this._settings == false)
            throw new Error('Property "template" of type string required on settings object');

        return this._buildRegex(this.buildTemplate((<RXSingle>this._settings).template));
    }

    buildList() : Array<AugmentedExp> {
        if ('templateList' in this._settings == false)
            throw new Error('Property "templateList" of type Array<string> required on settings object');

        const regexList: Array<AugmentedExp> = [];
        for (let template of (<RXList>this._settings).templateList) {
            const regexString = this.buildTemplate(template);
            regexList.push(this._buildRegex(regexString, template));
        }
        
        return regexList;
    }

    private _buildRegex(regexString: string, template?: string) : AugmentedExp {
        return new AugmentedExp(regexString, this._settings.flags, 
            (template) ?? (<RXSingle>this._settings).template);
    }

}
