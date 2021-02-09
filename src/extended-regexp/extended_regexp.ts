import { TemplateBracketHandler } from "../template-group-handler/template_string_handler";

export interface RegExpMatchMap {
    full_match: string,
    [key: string]: string
}

/** Decorated JavaScript RegExp with additional methods and properties. */
export class ExtendedRegExp {
    constructor(private readonly pattern: RegExp,
                private readonly template: string,
                private readonly automap: boolean) { }

    get dotAll(): boolean {
        return this.pattern.dotAll;
    }

    get flags(): string {
        return this.pattern.flags;
    }

    get global(): boolean {
        return this.pattern.global;
    }

    get ignoreCase(): boolean {
        return this.pattern.ignoreCase;
    }

    get lastIndex(): number {
        return this.pattern.lastIndex;
    }

    set lastIndex(value: number) {
        this.pattern.lastIndex = value;
    }

    get multiline(): boolean {
        return this.pattern.multiline;
    }

    get source(): string {
        return this.pattern.source;
    }

    get sticky(): boolean {
        return this.pattern.sticky;
    }

    get unicode(): boolean {
        return this.pattern.unicode;
    }
    /** Throughput method for RegExp.exec. */
    exec(string: string): RegExpMatchArray | null {
        return this.pattern.exec(string);
    }
    /** Throughput method for RegExp.test. */
    test(string: string): boolean {
        return this.pattern.test(string);
    }
    /** Throughput method for String.match.  */
    match(string: string): RegExpMatchArray | null | RegExpMatchMap {
        if (this.automap) {
            return this.matchMap(string);
        }
        return string.match(this.pattern);
    }
    /** Throughput method for String.matchAll. */
    matchAll(string: string): IterableIterator<RegExpMatchArray> {
        return string.matchAll(this.pattern);
    }
    /** Throughput method for String.replace. */
    replace(string: string, replaceValue: string): string {
        return string.replace(this.pattern, replaceValue);
    }
    /** Throughput method for String.search. */
    search(string: string): number {
        return string.search(this.pattern);
    }
    /** Throughput method for String.split. */
    split(string: string, limit?: number | undefined): string[] {
        return string.split(this.pattern, limit);
    }

    // -----Additional methods-----

    /** Returns the template string for this pattern. */
    getTemplate(): string {
        return this.template;
    }
    /**
     * @experimental
     * Performs String.match(RegExp) but maps the matches to an object with the 
     * pattern's template capturing groups as keys.
     * 
     * For example, when given RegExpMatchArray  
     * `['hello world', 'world']` with template `'greeting (region)'`,  
     *  the result will be  
     *  `{ full_match: 'hello world', region: 'world' }`.
     */
    matchMap(string: string): RegExpMatchMap | null {
        const matches = string.match(this.pattern);
        if (!matches) return null;
        return this.map(matches);
    }
    /**
     * @experimental
     * Maps an array of matches according to the template of the pattern.
     * Returns an object with a key for the full match and one for each capturing group in the template.
     * Called as part of `matchMap()`.
     */
    map(matches: RegExpMatchArray): RegExpMatchMap {
        const map: RegExpMatchMap = { full_match: matches[0] };
        const groupNames = new TemplateBracketHandler(this.template, '(').handleBrackets();
        if (/\bfilter\b/.test(this.template)) {
            throw new Error(`(regexbuilder) Error mapping template: Cannot map unnamed capturing group added with \"filter\" method. Please use
             the indexes of the matches array instead when using a filter (valid matches in index 1, exceptions only in index 0).`);
        }
        for (let [i, name] of groupNames.entries()) {
            map[name] = matches[i + 1];
        }
        return map;
    }
}