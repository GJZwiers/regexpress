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
    }

}

export interface RegexMap {
    [key: string]: any
}

export class TemplateGroupMapper {
    static map(results: RegExpMatchArray, template: string) : object {
        let map: RegexMap = { fullMatch: results[0] };
        const groups = template.match(/(?<=\()\w+(?=\))/g);
        
        if (!groups) return map;
        
        for (let j = 0; j < results.length; j++) {
            const key = groups[j];
            map[key] = results[j];
        }
        return map;
    }
}

// const builder = new RegexBuilder();
// const regex = builder.addGroup('(values)', ['a', 'b', 'c'])
//                         .add('separators', '[: ]+')
//                         .addGroup('(?=lookaheads)', ['d', 'e'])
//                         .setFlags('gi')
//                         .build();

// console.log(regex);
// const testText = "aa d";
// const results = testText.match(regex);

// if (results) {
//     const mappedResults = TemplateGroupMapper.map(results, builder.getTemplate());
//     console.log(mappedResults);
// }
