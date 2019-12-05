import { AugmentedExp } from './augmentedExp';

export interface RXData {
    [key: string]: string[] | string
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
            template += this._substituteGroup(namedGroup, this._substitutePlaceholder(builtGroup));
        }

        return template;
    }

    protected _buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this._settings.symbol || '|') : group;
    }

    protected _substituteGroup(group: string, b: string) : string {
        return this._settings.template.replace(group, b);
    }

    protected _substitutePlaceholder(group: string) : string {
        const tis = this;
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!tis._placeholderData[p1]) throw new Error(`found undefined placeholder ${match} in regex data`);
            return tis._buildGroup(tis._placeholderData[p1]);
        });
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
