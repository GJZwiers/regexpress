export class AugmentedExp extends RegExp {
    private _template: string

    constructor(pattern: string, flags: string, template: string) {
        super(pattern, flags);
        this._template = template;
    }

    getTemplate() {
        return this._template;
    }
}

export class ExtendedRegExp { 
    constructor(private pattern: RegExp, private template: string) { }

    getTemplate(): string {
        return this.template;
    }

    test(string: string): boolean {
        return this.pattern.test(string)
    }

    match(string: string): RegExpMatchArray | null {
        return string.match(this.pattern);
    }
}
