import { RXData, RXPlaceholder, RXSettingsBase } from './IRegex';
import { TemplateMapper } from './templatemapper';

// perform sorting on regex data before build methods?

interface LogicObj {
    pattern: RegExp,
    fn: any
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
                this._sortGroup(<string[]> this._regexData[namedGroup]);
            }
        }
    }

    protected _isAutoSortable(group: string[] | string) {
        return (Array.isArray(group) 
                && this._settings.autosort === true 
                && this._settings.separator === ('|' || undefined));
    }

    protected _sortGroup(group: string[]) : string[] {
        const patternsWithMetas: string[] = group.filter(element => {
            return /(?!\\)(?:\*|\+)/.test(element);
        });

        const patternsWithLiterals: string[] = group.filter(element => {
            return /(?!\\)(?:\*|\+)/.test(element) === false;
        });

        const quantPattern = /.\{(\d+),?\s?(\d+)?\}/g;  // Replace quants?
        const nonQuantPattern = /(?!<=\{)\w+(?!\{|.+\}[}{*+])|(?=\\)[?+*$^{}()\[\]\\]/g;

        const sortLogic = (a: string, b: string) => {
            const aMax = this._calculateMatchLength(a, { pattern: quantPattern, fn: this._addQuant }) 
                        + this._calculateMatchLength(a, { pattern: nonQuantPattern, fn: this._addNonQuant });

            const bMax = this._calculateMatchLength(b, { pattern: quantPattern, fn: this._addQuant })
                        + this._calculateMatchLength(b, { pattern: nonQuantPattern, fn: this._addNonQuant });
            
            return bMax - aMax;
        };

        patternsWithMetas.sort(sortLogic);
        patternsWithLiterals.sort(sortLogic);

        const allSorted = patternsWithMetas.concat(patternsWithLiterals);
        console.log(allSorted);

        return allSorted;
    }

    protected _calculateMatchLength(regexString: string, obj: LogicObj) : number {
        const matchesList = regexString.matchAll(obj.pattern);
        let total = 0;

        if (matchesList === null)
            return total;

        for (let matches of matchesList) {
            total += obj.fn(matches);
        }
        console.log(total, regexString);
        return total;
    }

    protected _calculateMaxMatchLength(regexString: string) : number {
        const quantPattern = /.\{(\d+),?\s?(\d+)?\}/g;
        const nonQuantPattern = /(?!<=\{)\w+(?!\{)|(?=\\)[?+*$^{}()\[\]\\]/g;
        let total = 0;

        const matches = regexString.matchAll(quantPattern);
        const includeInCount = regexString.matchAll(nonQuantPattern);

        if (matches !== null) {
            for (let match of matches) {
                total += this._addQuant(match);
            }
        }

        if (includeInCount !== null) {
            for (const match of includeInCount) {
                total += this._addNonQuant(match);
            }
        }

        console.log(total, regexString);
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
