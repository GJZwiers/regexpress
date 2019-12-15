import { RXData, RXPlaceholder, RXSettingsBase } from './IRegex';
import { TemplateMapper } from './templatemapper';

// perform sorting on regex data before build methods?

interface RegexDto {
    quant: RegExp,
    nonQuant: RegExp
}

export abstract class RegexBuilderBase {
    protected _regexData: RXData;
    protected _settings: RXSettingsBase;
    protected _placeholderData: RXPlaceholder;

    constructor(regexData: RXData, settings: RXSettingsBase, placeholders?: RXPlaceholder) {
        this._regexData = regexData;
        this._settings = settings;  
        this._placeholderData = placeholders || {};
    }

    protected _buildTemplate(template: string) : string {
        for (const namedGroup in this._regexData) {
            const builtGroup = this._buildGroup(this._regexData[namedGroup]);
            const subbedGroup = this._substitutePlaceholder(builtGroup);
            template = template.replace(new RegExp(`${namedGroup}(?=\\W)`, 'g'), subbedGroup);
        }
        
        return template;
    }

    protected _buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this._settings.separator || '|') : group;
    }

    protected _substitutePlaceholder(group: string) : string {
        const swap = (match: string, p1: string) => {
            if (!this._placeholderData[p1]) throw new Error(`found undefined placeholder ${match} in regex data`);
            return this._buildGroup(this._placeholderData[p1]);
        };

        return group.replace(/~~(\w+)~~/, swap);
    }

    public autoSort() {
        for (const namedGroup in this._regexData) {
            if (this._isAutoSortable(this._regexData[namedGroup])) {
                const sortedGroup = this._sortGroup(<string[]> this._regexData[namedGroup]);
                console.log(sortedGroup);
            }
        }
    }

    protected _isAutoSortable(group: string[] | string) {
        return (Array.isArray(group) 
                && this._settings.autosort === true 
                && this._settings.separator === ('|' || undefined));
    }

    protected _sortGroup(group: string[]) : string[] {
        const regexes: RegexDto = {
            quant: /.\{(\d+),?\s?(\d+)?\}/g,
            nonQuant: /(?!<=\{)\w+(?!\{|.+\}[}{*+])|(?=\\)[?+*$^{}()\[\]\\]/g
        };

        const sortLogic = (a: string, b: string) => {
            return this._getLargestMatchLength(b, regexes) - this._getLargestMatchLength(a, regexes);
        };

        const patternsWithMetas: string[] = group.filter(element => {
            return /(?!\\)(?:\*|\+)/.test(element);
        });

        patternsWithMetas.sort(sortLogic);

        const patternsWithLiterals: string[] = group.filter(element => {
            return /(?!\\)(?:\*|\+)/.test(element) === false;
        });

        patternsWithLiterals.sort(sortLogic);

        return patternsWithMetas.concat(patternsWithLiterals);
    }

    protected _getLargestMatchLength(regexString: string, patterns: RegexDto) : number {
        let total = 0;

        const matches = regexString.replace(patterns.quant, (match, min, max) => {
            total += (max) ? parseInt(max) : parseInt(min);
            return '';
        });

        const includeInCount = matches.matchAll(patterns.nonQuant);

        if (includeInCount === null)
            return total;

        for (const match of includeInCount) {
            total += this._addNonQuant(match);
        }

        return total;
    }

    protected _addQuant(match: RegExpMatchArray) : number {
        const map: any = TemplateMapper.map(match, '(minrange)(maxrange)');
        return (map.maxrange !== undefined) ? parseInt(map.maxrange) : parseInt(map.minrange);
    }

    protected _addNonQuant(match: RegExpMatchArray) : number {
        const map: any = TemplateMapper.map(match, '');
        return map.fullMatch.length;
    }

}
