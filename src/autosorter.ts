import { RXData } from "./IRegex";
import { TemplateMapper } from "./templatemapper";

interface IRegexListSorter {
    autoSort(): RXData
}

interface RegexDto {
    quant: RegExp,
    nonQuant: RegExp
}

export class AutoSorter {
    private readonly _regexData: RXData;

    constructor(regexData: RXData) {
        this._regexData = regexData;
    }

    public autoSort() {
        let sortedData: RXData = {};
        for (const namedGroup in this._regexData) {
            if (!this._isAutoSortable(this._regexData[namedGroup])) 
                continue;

            sortedData[namedGroup] = this._sortGroup(<string[]> this._regexData[namedGroup]);
        }
        
        return sortedData;
    }

    protected _isAutoSortable(group: string[] | string) {
        return (Array.isArray(group));
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
