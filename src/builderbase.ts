import { RXData, RXPlaceholder, RXSettingsBase } from './IRegex';

// perform sorting on regex data before build methods

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
        console.log('started auto sort');
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
        console.log('unsorted', group);
        group.sort((a: string, b: string) => {
            const first = this._calculateMaxMatchLength(a);
            const second = this._calculateMaxMatchLength(b);
            console.log(first, second);
            return second - first;
        });

        console.log('sorted', group);
        return group;
    }

    // {n} {n,m} +* ?
    // recursive quantifier match
    // if found add amount to sum and call match again from lastIndex;

    protected _calculateMaxMatchLength(regexString: string) : number {
        const quantPattern = /.\{(\d+),?\s?(\d+)?\}/;
        const matches = regexString.match(quantPattern);

        if (!matches) return 0;

        let total = 0;
        total += (matches[2] !== undefined) ?  parseInt(matches[2]) : parseInt(matches[1]);

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
