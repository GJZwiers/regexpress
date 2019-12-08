import * as rxp from './index';

export class Regexpress {

    constructor() {}

    buildRegex(RXData: rxp.RXData, RXSettings: rxp.RXSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        return new rxp.TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: rxp.RXData, RXListSettings: rxp.RXListSettings, RXPlaceholder?: rxp.RXPlaceholder) {
        return new rxp.TemplateListBuilder(RXData, RXListSettings, RXPlaceholder).build();
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return rxp.TemplateMapper.map(results, template);
    }
    
}
