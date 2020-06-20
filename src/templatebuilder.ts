import { AugmentedExp } from './augmentedExp';
import { RegexBuilderBase } from './builderbase';
import { RegexListSettings, RegexSettings, RegexData, RegexPlaceholder } from './IRegex';

export class TemplateBuilder extends RegexBuilderBase {
    protected _settings: RegexSettings;

    constructor(regexData: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholder) {
        super(regexData, settings, placeholders);
        this._settings = settings;  
    }

    public build() : AugmentedExp {
        return this._buildRegex(this._buildTemplate(this._settings.template));
    }

    private _buildRegex(regexString: string) : AugmentedExp {
        return new AugmentedExp(regexString, this._settings.flags, this._settings.template);
    }

}

export class TemplateListBuilder extends RegexBuilderBase {
    protected _settings: RegexListSettings;

    constructor(regexData: RegexData, settings: RegexListSettings, placeholders?: RegexPlaceholder) {
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
