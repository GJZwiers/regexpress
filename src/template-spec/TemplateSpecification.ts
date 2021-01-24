import { PatternData, PatternSettings } from '../pattern-data/interfaces';

interface TemplateSpecification {
    buildTemplate(template: string) : string;
}

abstract class SpecificationBase {
    constructor(protected data: PatternData, protected settings: PatternSettings) { }
}

class DefaultSpecification extends SpecificationBase implements TemplateSpecification {
    private placeholders: PatternData;

    constructor(data: PatternData, settings: PatternSettings, placeholders?: PatternData) {
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
        return group.replace(/\{\{(\w+)\}\}/, (match: string, p1: string) => {
            if (!this.placeholders[p1]) {
                throw new Error(`undefined placeholder ${match} in regex data`);
            }
            return this.buildGroup(this.placeholders[p1]);
        });
    }
}




class NoPlaceHolderSpecification extends SpecificationBase implements TemplateSpecification {
    constructor(data: PatternData, settings: PatternSettings) {
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
    constructor(data: PatternData, settings: PatternSettings, placeholders?: PatternData) {
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

export type { TemplateSpecification }
export { DefaultSpecification }