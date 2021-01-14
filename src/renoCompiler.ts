import { ExtendedRegExp } from './augmentedExp';
import { DefaultSpecification, TemplateSpecification } from './templatebuilder';
import { RegexNotationObject } from './renoBuilder'

class PatternCrafter {
    craft(reno: RegexNotationObject): ExtendedRegExp[] {
        if (typeof reno.settings.template === 'string') {
            reno.settings.template = [reno.settings.template];
        }

        const tm = new PatternMaker(
            new DefaultSpecification(reno.data, reno.settings, reno.placeholders));
        const patterns = tm.build(reno.settings.template, reno.settings.flags);

        if (patterns.length > 1) {
            let regexes = [];
            for (let pattern of patterns) {
                let re = this.craftPattern(pattern);
                regexes.push(re);
            }
            return regexes;
        }
     
        return [this.craftPattern(patterns[0])];
    }

    private craftPattern(pattern: ReObject): ExtendedRegExp {
        return new ExtendedRegExp(pattern.regex, pattern.template);
    }
}

interface ReObject {
    regex: RegExp,
    template: string
}

class PatternMaker {
    private spec: TemplateSpecification;

    constructor(spec: TemplateSpecification) {
        this.spec = spec;
    }

    build(templates: string[], flags: string) : Array<ReObject> {
        const regexes: Array<ReObject> = [];
        for (let template of templates) {
            const regexString = this.spec.buildTemplate(template);
            const regex = this.buildRegex(regexString, flags, template);
            regexes.push(regex);
        }
        return regexes;
    }

    private buildRegex(regexString: string, flags: string, template: string): ReObject {
        return { regex: new RegExp(regexString, flags), template };
    }
}

export { PatternCrafter, PatternMaker, ReObject }