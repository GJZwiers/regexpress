import { RXData } from "./rxtypes";
import { TemplateMapper } from "./templatemapper";

interface IRXStringListSorter {
    autoSort(): RXData
}

interface RegexDto {
    quant: RegExp,
    nonQuant: RegExp
}

export class AutoSorter implements IRXStringListSorter {
    private readonly _regexData: RXData;

    constructor(regexData: RXData) {
        this._regexData = regexData;
    }

    public autoSort() : RXData {
        let sortedData: RXData = {};
        for (const namedGroup in this._regexData) {
            if (!this._isAutoSortable(this._regexData[namedGroup])) 
                continue;

            sortedData[namedGroup] = this._sortGroup(<string[]> this._regexData[namedGroup]);
        }
        
        return sortedData;
    }

    private _isAutoSortable(group: string[] | string) {
        return (Array.isArray(group));
    }

    // To-do: differentiate between * and + chars maxlength
    private _sortGroup(group: string[]) : string[] {
        const regexes: RegexDto = {
            quant: /.\{(\d+),?\s?(\d+)?\}/g,
            nonQuant: /(?!<=\{)\w+(?!\{|.+\}[}{*+])|(?=\\)[?+*$^{}()\[\]\\]/g
        };

        const sortLogic = (a: string, b: string) => {
            return this._maxMatchLength(b, regexes) - this._maxMatchLength(a, regexes);
        };

        const metaQuants = /(?!\\)(?:\*|\+)/;

        const patternsWithMetas: string[] = group
            .filter(element => { return metaQuants.test(element) === true;})
            .sort(sortLogic);

        const patternsWithLiterals: string[] = group
            .filter(element => { return metaQuants.test(element) === false;})
            .sort(sortLogic);

        return patternsWithMetas.concat(patternsWithLiterals);
    }

    private _maxMatchLength(regexString: string, patterns: RegexDto) : number {
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

    private _addNonQuant(match: RegExpMatchArray) : number {
        const map: any = TemplateMapper.map(match, '');
        return map.fullMatch.length;
    }
}
