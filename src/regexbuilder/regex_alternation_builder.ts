import { groupCode, groupStarters, processGroupCode } from "./process_group_code";
import { RegexBuilderBase } from "./regex_builder_base";

export class RegexAlternationBuilder extends RegexBuilderBase {
    /** Joins a list of string components as regex alternates. 
     * 
     *       .alts(['foo','bar']) >> /foo|bar/
    */
    alts(alts: (string | RegExp)[]): this {
        alts.forEach((item: string | RegExp, index: number, arr: (string | RegExp)[]) => {
            if (item instanceof RegExp) {
                arr[index] = item.source;
            }
        });
        this.regex.parts.push(alts.join('|'));
        return this;
    }
    /** Wraps a list of string components in a regex group type and joins them with `|` to regex alternates. 
     * 
     *       .altGroup(['foo','bar'], 'ncg') >> /(?:foo|bar)/
    */
    altGroup(alts: string[], groupCode: groupCode): this {
        const grouptype = processGroupCode(groupCode);
        this.regex.parts.push(grouptype, alts.join('|'), groupStarters.close)
        return this;
    }
    /** Wraps a list of string components in a regex group type and joins them with the provided separator. 
     * 
     *       .joinGroup(['foo','bar'], 'ncg', '-') >> /(?:foo-bar)/
    */
    joinGroup(vals: string[], separator: string, groupCode?: groupCode): this {
        if (groupCode) {
            const grouptype = processGroupCode(groupCode);
            this.regex.parts.push(grouptype, vals.join(separator), groupStarters.close);
        } else {
            this.regex.parts.push(vals.join(separator));
        }
        return this;
    }
    /** 
     * @deprecated
     * Joins a list of string components with the provided separator, same as Array.join() 
    */
    joinWith(vals: string[], separator: string): this {
        this.regex.parts.push(vals.join(separator));
        return this;
    }
}