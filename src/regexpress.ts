import * as rxp from './index';

export class Regexpress {

    constructor() {}

    autoSort(RXData: rxp.RXData) {
        return new rxp.AutoSorter(RXData).autoSort();
    }

    buildRegex(RXData: rxp.RXData, RXSettings: rxp.RXSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXSettings)) {
            RXData = this.autoSort(RXData);
        }
        
        return new rxp.TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: rxp.RXData, RXListSettings: rxp.RXListSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXListSettings)) {
            RXData = this.autoSort(RXData);
        }

        return new rxp.TemplateListBuilder(RXData, RXListSettings, RXPlaceholder).build();
    }

    private _isAutoSortable(RXSettings: rxp.RXSettings | rxp.RXListSettings) {
        return (RXSettings.autosort && RXSettings.separator === ('|' || undefined));
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return rxp.TemplateMapper.map(results, template);
    }
    
}
