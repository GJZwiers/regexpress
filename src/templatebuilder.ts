import { AugmentedExp } from './augmentedExp';
import { RegexBuilderBase } from './builderbase';

interface Buildable {
    build() : RegExp;
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
