import { AugmentedExp } from './augmentedExp';
import { DefaultSpecification } from './templatebuilder';
import { AutoSorter, RegexData, RegexSettings, RegexPlaceholders,
         TemplateBuilder, TemplateMapper } from './index';

export default class Regexpress {
    constructor() {}

    autoSort(data: RegexData) {
        return new AutoSorter(data).autoSort();
    }

    /** 
     * Constructs a new pattern from a regex notation object.
        @param {RegexData} data - An object with keys named similarly to regex template groups.
        @param {RegexSettings} settings - An object with settings tuning the pattern's behavior.
        @param {RegexPlaceholders} placeholders - An object with substitutes for any placeholder syntax (~~MYPLACEHOLDER~~) in the regex template's values.
    */
    build(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders): Array<AugmentedExp> {
        if (this.isAutoSortable(settings)) {
            data = this.autoSort(data);
        }
        if (typeof settings.template === 'string') {
            settings.template = [settings.template];
        }
        return new TemplateBuilder(
            new DefaultSpecification(data, settings, placeholders))
            .build(<string[]>settings.template, settings.flags);
    }

    private isAutoSortable(RegexSettings: RegexSettings): boolean | undefined {
        return (RegexSettings.autosort && RegexSettings.separator === ('|' || undefined));
    }

    /**
     * DEPRECATED, please use [instance].build() with the appropriate arguments.
     */
    buildRegex(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders): AugmentedExp {
        return this.build(data, settings, placeholders)[0];
    }

    /**
     * DEPRECATED, please use [instance].build() with the appropriate arguments.
     */
    buildRegexes(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders): Array<AugmentedExp> {
        return this.build(data, settings, placeholders);
    }

    /** 
     * Map an array of matches to an object of keys with identical names as those in the regex template.
        @param {RegExpMatchArray | null} results - The results of a regex match.
        @param {string} template - The template to be used to map the results. 
    */
    mapTemplate(results: RegExpMatchArray | null, template: string): object {
        return TemplateMapper.map(results, template);
    }
}
