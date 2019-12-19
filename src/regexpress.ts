import * as rxp from './index';
import { RXSetting, RXSingle, RXList } from './builderbase';

export class Regexpress {

    constructor() {}

    autoSort(RXData: rxp.RXData) {
        return new rxp.AutoSorter(RXData).autoSort();
    }

    buildRegex(RXData: rxp.RXData, RXSettings: RXSetting, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXSettings))
            RXData = this.autoSort(RXData);
        
        return new rxp.TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: rxp.RXData, RXListSettings: RXSetting, RXPlaceholder?: rxp.RXPlaceholder) {
        if (this._isAutoSortable(RXListSettings))
            RXData = this.autoSort(RXData);

        return new rxp.TemplateBuilder(RXData, RXListSettings, RXPlaceholder).buildList();
    }

    buildAll(regexes: object) {
        for (const field in regexes) {
            //field.buildRegex(field.data, field.settings, field.placeholders);
        }
    }

    private _isAutoSortable(RXSettings: rxp.RXSettings | rxp.RXListSettings) {
        return (RXSettings.autosort && RXSettings.separator === ('|' || undefined));
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return rxp.TemplateMapper.map(results, template);
    }
    
}
