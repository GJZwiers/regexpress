import { TemplateBuilder, TemplateListBuilder, RXData, RXSettings, RXListSettings, RXPlaceholder } from './index';
import { TemplateMapper } from './templatemapper';

export class Regexpress {

    constructor() {}

    buildRegex(RXData: RXData, RXSettings: RXSettings, RXPlaceholder?: RXPlaceholder) {
        return new TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: RXData, RXListSettings: RXListSettings, RXPlaceholder?: RXPlaceholder) {
        return new TemplateListBuilder(RXData, RXListSettings, RXPlaceholder).build();
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return TemplateMapper.map(results, template);
    }
}
