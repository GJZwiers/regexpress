import * as rxp from './index';
import { RXSettings } from './rxtypes';

// Façade
export class Regexpress {

    constructor() {}

    autoSort(RXData: rxp.RXData) {
        return new rxp.AutoSorter(RXData).autoSort();
    }

    buildRegex(RXData: rxp.RXData, RXSettings: RXSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXSettings))
            RXData = this.autoSort(RXData);
        
        return new rxp.TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: rxp.RXData, RXListSettings: RXSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXListSettings))
            RXData = this.autoSort(RXData);

        return new rxp.TemplateBuilder(RXData, RXListSettings, RXPlaceholder).buildList();
    }

    private _isAutoSortable(RXSettings: RXSettings) {
        return (RXSettings.autosort && RXSettings.separator === ('|' || undefined));
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return rxp.TemplateMapper.map(results, template);
    }
    
}
