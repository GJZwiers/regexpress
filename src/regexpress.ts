import { AugmentedExp } from './augmentedExp';
import { DefaultSpecification, TemplateSpecification, TemplateMaker } from './templatebuilder';
import { AutoSorter, RegexData, RegexSettings, RegexPlaceholders, TemplateMapper } from './index';
import { RegexNotationObject, RenoBuilder } from './renoBuilder';

export class RegExpress {
    private spec: TemplateSpecification;

    constructor(spec?: TemplateSpecification) {
        this.spec = spec ?? new DefaultSpecification(
            {},
            {template: '', flags: ''}
        );
    }

    /** 
     * Constructs a new pattern from a regex data object.
        @param {RegexData} data - An object with keys named similarly to regex template groups.
        @param {RegexSettings} settings - An object with settings tuning pattern behavior.
        @param {RegexPlaceholders} [placeholders] - An object with substitutes for any placeholder syntax (\~\~MYPLACEHOLDER\~\~) in the regex template's values.
    */
    build(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders): Array<AugmentedExp> {
        if (this.isAutoSortable(settings)) {
            data = this.autoSort(data);
        }

        this.validate(settings);

        let spec = new DefaultSpecification(data, settings, placeholders);

        return new TemplateMaker(spec).build(<string[]>settings.template, settings.flags);
    }

    static builder(): RenoBuilder {
        return RegexNotationObject.new();
    }

    private validate(settings: RegexSettings) {
        if (!settings.template) {
            throw new Error('Invalid template string in regex data.')
        }
        if (typeof settings.template === 'string') {
            settings.template = [settings.template];
        }
        if (settings.flags === undefined) {
            settings.flags = '';
        }
    }

    private isAutoSortable(RegexSettings: RegexSettings): boolean | undefined {
        return (RegexSettings.autosort && RegexSettings.separator === ('|' || undefined));
    }

    autoSort(data: RegexData) {
        return new AutoSorter(data).autoSort();
    }

    /**
     * @deprecated please use [instance].build() with the appropriate arguments.
     */
    buildRegex(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders): AugmentedExp {
        return this.build(data, settings, placeholders)[0];
    }

    /**
     * @deprecated please use [instance].build() with the appropriate arguments.
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
