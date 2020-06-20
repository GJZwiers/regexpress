import * as Regexp from './index';

export class Regexpress {

    constructor() {}

    autoSort(RegexData: Regexp.RegexData) {
        return new Regexp.AutoSorter(RegexData).autoSort();
    }

    buildRegex(RegexData: Regexp.RegexData, RegexSettings: Regexp.RegexSettings, RegexPlaceholder?: Regexp.RegexPlaceholder) {
        if (this._isAutoSortable(RegexSettings)) {
            RegexData = this.autoSort(RegexData);
        }
        
        return new Regexp.TemplateBuilder(RegexData, RegexSettings, RegexPlaceholder).build();
    }

    buildRegexes(RegexData: Regexp.RegexData, RegexListSettings: Regexp.RegexListSettings, RegexPlaceholder?: Regexp.RegexPlaceholder) {
        if (this._isAutoSortable(RegexListSettings)) {
            RegexData = this.autoSort(RegexData);
        }

        return new Regexp.TemplateListBuilder(RegexData, RegexListSettings, RegexPlaceholder).build();
    }

    private _isAutoSortable(RegexSettings: Regexp.RegexSettings | Regexp.RegexListSettings) {
        return (RegexSettings.autosort && RegexSettings.separator === ('|' || undefined));
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return Regexp.TemplateMapper.map(results, template);
    }
    
}
