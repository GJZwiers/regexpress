import { AugmentedExp } from './augmentedExp';

export interface RXData {
    [key: string]: string[]
}

export interface RXSettings {
    template: string
    flags: string
    symbol?: string
}

export abstract class RBuilderBase {
    protected _regexData: RXData;
    protected _settings: RXSettings;
    protected _placeholderData: RXData;

    constructor(regexData: RXData, settings: RXSettings, placeholders?: RXData) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    protected _buildTemplate() : string {
        let template = '';
        for (const namedGroup in this._regexData) {
            let builtGroup = this._buildGroup(this._regexData[namedGroup]);
            template += this._substituteGroup(namedGroup, builtGroup);
        }

        return template;
    }

    protected _buildGroup(group: string[]) : string {
        return group.join(this._settings.symbol || '|');
    }

    protected _substituteGroup(group: string, b: string) : string {
        return this._settings.template.replace(group, b);
    }
}

export class NRegexBuilder extends RBuilderBase {

    build() : AugmentedExp {
        return this._buildRegex(this._buildTemplate());
    }

    private _buildRegex(template: string) : AugmentedExp {
        return new AugmentedExp(template, this._settings.flags, this._settings.template);
    }

}
