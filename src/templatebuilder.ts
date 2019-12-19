import { AugmentedExp } from './augmentedExp';
import { RegexBuilderBase, RXSetting, RXSingle, RXList } from './builderbase';
import { RXListSettings, RXSettings, RXData, RXPlaceholder } from './IRegex';

interface IRBuilder {
    build() : AugmentedExp
}

export class TemplateBuilder extends RegexBuilderBase {

    constructor(regexData: RXData, settings: RXSetting, placeholders?: RXPlaceholder) {
        super(regexData, settings, placeholders);
    }

    public build() : AugmentedExp {
        if ('template' in this._settings == false)
            throw new Error('template property of type string required on settings object');

        return this._buildRegex(this._buildTemplate((<RXSingle>this._settings).template));
    }

    public buildList() : Array<AugmentedExp> {
        if ('templateList' in this._settings == false)
            throw new Error('templateList property of type Array<string> required on settings object');

        const regexList: Array<AugmentedExp> = [];
        for (let template of (<RXList>this._settings).templateList) {
            const regexString = this._buildTemplate(template);
            regexList.push(this._buildRegex(regexString, template));
        }
        
        return regexList;
    }

    private _buildRegex(regexString: string, template?: string) : AugmentedExp {
        return new AugmentedExp(regexString, this._settings.flags, 
            (template) ? template : (<RXSingle>this._settings).template);
    }

}

export class TemplateListBuilder extends RegexBuilderBase {
    protected _settings: RXListSettings;

    constructor(regexData: RXData, settings: RXListSettings, placeholders?: RXPlaceholder) {
        super(regexData, settings, placeholders);
        this._settings = settings;
    }

    public build() : Array<AugmentedExp> {
        const regexList: Array<AugmentedExp> = [];
        for (let template of this._settings.templateList) {
            const regexString = this._buildTemplate(template);
            regexList.push(this._buildRegex(regexString, template));
        }
        
        return regexList;
    }

    private _buildRegex(regexString: string, template: string) : AugmentedExp {
        return new AugmentedExp(regexString, this._settings.flags, template);
    }

}
