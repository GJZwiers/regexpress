import { RXData, RXPlaceholder, RXSettingsBase } from './IRegex';
import { TemplateMapper } from './templatemapper';

// perform sorting on regex data before build methods?

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

    // sort metas descending min length
    protected _sortGroup(group: string[]) : string[] {
        const metaList: string[] = group.filter((element, index) => {
            return /(?!\\)(?:\*|\+)/.test(element);
        });

        const litList: string[] = group.filter((element, index) => {
            return /(?!\\)(?:\*|\+)/.test(element) === false;
        });

        metaList.sort((a: string, b: string) => {
            const first = this._calculateMinMatchLength(a);
            const second = this._calculateMinMatchLength(b);
            return second - first;
        });
        
        litList.sort((a: string, b: string) => {
            const first = this._calculateMaxMatchLength(a);
            const second = this._calculateMaxMatchLength(b);
            return second - first;
        });

        const allSorted = metaList.concat(litList);
        console.log(allSorted);

        return allSorted;
    }

    protected _calculateMinMatchLength(regexString: string) : number {
        const countables = /\w+|(?=\\)[?+*$^{}()\[\]\\]/g
        let total = 0;

        const includeInCount = regexString.match(countables);
        console.log(includeInCount);

        if (includeInCount !== null) {
            for (const match of includeInCount) {
                total += match.length;
            }
            return total;
        }

        return 1;
    }

    // if * or + present theoretical limit is infinite -> sort these by minimum amount instead (10 -> inf, 2 -> inf, 10-28, 7)

    protected _calculateMaxMatchLength(regexString: string) : number {
        const quantPattern = /.\{(\d+),?\s?(\d+)?\}/;

        let total = 0;

        const finiteQuants = regexString.match(quantPattern);
        if (finiteQuants !== null) {
            const map: any = TemplateMapper.map(finiteQuants, '(minrange)(maxrange)');
            total += (map.maxrange !== undefined) ? parseInt(map.maxrange) : parseInt(map.minrange);
        }
        
        return total;
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

}
