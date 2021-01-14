import { RegexData, RegexPlaceholders, RegexSettings } from './interfaces';
import { AugmentedExp } from './augmentedExp';

interface TemplateSpecification {
    buildTemplate(template: string) : string;
}

abstract class SpecificationBase {
    constructor(protected data: RegexData, protected settings: RegexSettings) { }
}

class TemplateMaker {
    private spec: TemplateSpecification;

    constructor(spec: TemplateSpecification) {
        this.spec = spec;
    }

    build(templates: string[], flags: string) : Array<AugmentedExp> {
        const regexes: Array<AugmentedExp> = [];
        for (let template of templates) {
            const regexString = this.spec.buildTemplate(template);
            const regex = this.buildRegex(regexString, flags, template);
            regexes.push(regex);
        }
        return regexes;
    }

    private buildRegex(regexString: string, flags: string, template: string) : AugmentedExp {
        return new AugmentedExp(regexString, flags, template);
    }
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    private placeholders: RegexPlaceholders;

    constructor(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders) {
        super(data, settings);
        this.placeholders = placeholders || {};
    }

    buildTemplate(template: string) : string {
        for (const name in this.data) {
            const group = this.subPlaceholder(this.buildGroup(this.data[name]));
            template = template.replace(new RegExp(`${name}(?=\\W|$)`, 'g'), group);
        }
        return template;
    }

    protected buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this.settings.separator || '|') : group;
    }

    protected subPlaceholder(group: string) : string {
        return group.replace(/~~(\w+)~~/, (match: string, p1: string) => {
            if (!this.placeholders[p1]) {
                throw new Error(`undefined placeholder ${match} in regex data`);
            }
            return this.buildGroup(this.placeholders[p1]);
        });
    }
}

class NoPlaceHolderSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(data: RegexData, settings: RegexSettings) {
        super(data, settings); 
    }

    buildTemplate(template: string) : string {
        for (const name in this.data) {
            const group = this.buildGroup(this.data[name]);
            template = template.replace(new RegExp(`${name}(?=\\W|$)`, 'g'), group);
        }
        return template;
    }

    protected buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this.settings.separator || '|') : group;
    }
}

class ExtraSettingSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(data: RegexData, settings: RegexSettings, placeholders?: RegexPlaceholders) {
        super(data, settings); 
    }

    buildTemplate(template: string) : string {
        if (this.settings.degrade === true) {
            console.log("Applying pattern degradation.")
        }
        for (const name in this.data) {
            const group = this.buildGroup(this.data[name]);
            template = template.replace(new RegExp(`${name}(?=\\W|$)`, 'g'), group);
        }
        return template;
    }

    protected buildGroup(group: string[] | string) : string {
        return (Array.isArray(group)) ? group.join(this.settings.separator || '|') : group;
    }
}

export { SpecificationBase, TemplateMaker, DefaultSpecification, TemplateSpecification, NoPlaceHolderSpecification, ExtraSettingSpecification }