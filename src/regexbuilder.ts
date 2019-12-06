interface RegexGroup {
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
        if (!Array.isArray(values)) throw new Error('please add groups as type Array');
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
