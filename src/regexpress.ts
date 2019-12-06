import { TemplateBuilder, TemplateListBuilder, RXData, RXSettings, RXPlaceholder } from './index';
import { TemplateMapper } from './templatemapper';

export class Regexpress {

    constructor() {}

    buildRegex(RXData: RXData, RXSettings: RXSettings, RXPlaceholder?: RXPlaceholder) {
        return new TemplateBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    buildRegexes(RXData: RXData, RXSettings: RXSettings, RXPlaceholder?: RXPlaceholder) {
        return new TemplateListBuilder(RXData, RXSettings, RXPlaceholder).build();
    }

    mapTemplate(results: RegExpMatchArray | null, template: string) {
        return TemplateMapper.map(results, template);
    }
}
