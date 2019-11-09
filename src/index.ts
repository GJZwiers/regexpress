export interface RegexGroup {
    name: string;
    values: Array<string>;
}

export class RegexBuilder {
    private groups: Array<RegexGroup> = [];
    private template = "";
    private flags = "";

    constructor() {}

    addGroup(name: string, values: Array<string>) : RegexBuilder {
        if (!/^\(/.test(name)) throw new Error('attempting to add regex group without brackets');
        this.template += name;
        this.groups.push({ name: name, values: values });

        return this;
    }

    add(name: string, values: string) : RegexBuilder {
        this.template += name;
        this.groups.push({ name: name, values: [values] });

        return this;
    }

    build() : RegExp {
        let template = "";
        for (const group of this.groups) {
            template += group.name.replace(/\w+/, group.values.join('|'));
        }

        return new RegExp(template, this.flags);
    }

    getTemplate() {
        return this.template;
    }

    setFlags(flags: string) : RegexBuilder {
        this.flags = flags;

        return this;
    }

    clear() {
        this.groups = [];
        this.template = "";
        this.flags = "";
    }

}

export interface RegexMap {
    [key: string]: any
}

export class TemplateGroupMapper {
    static map(results: RegExpMatchArray, template: string) : object {
        console.log(results, template);
        let map: RegexMap = { fullMatch: results[0] };
        const tGroups = template.match(/(?<=\()\w+(?=\))/g);
        
        if (!tGroups) return map;

        console.log(tGroups);
        tGroups.unshift('fullMatch');

        for (let j = 0; j < results.length; j++) {
            const key = tGroups[j];
            map[key] = results[j];
        }
        return map;
    }
}

interface RegexSettings
{
    template: string,
    flags: string
}

interface RegexData
{
    settings: RegexSettings
    [key: string]: any
}

interface PlaceholderSubstitutes
{
    [key: string]: any
}

export class RegexJSONBuilder {
    private _regexData: RegexData = { settings: { template: 'values', flags: '' }, values: ''};
    private template = this._regexData.settings.template;

    constructor() {}

    getTemplate() {
        return this.template;
    }

    build(field: RegexData) : RegExp {
        this._regexData = this.deepCopy(field);
        this.template = this._regexData.settings.template;
        this._buildGroups();
        const regex = this._buildTemplate();

        return new RegExp(regex, this._regexData.settings.flags);
    }

    deepCopy(field: RegexData) {
        return JSON.parse(JSON.stringify(field));
    }

    private _buildGroups() : void {
        for (const group in this._regexData) {
            if (!Array.isArray(this._regexData[group])) continue;
            this._regexData[group] = this._regexData[group].join('|');
        }
    }

    private _buildTemplate() : string {
        return this._substituteTemplateGroups();
    }

    private _substituteTemplateGroups() : string {
        let template = this.template;
        for (const group in this._regexData) {
            template = template.replace(group, this._regexData[group]);
        }
        
        return template;
    }

}

class RegexListBuilder {
    
}

