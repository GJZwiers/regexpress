interface RegexMap {
    [key: string]: any
}

export class TemplateGroupMapper {
    static map(results: RegExpMatchArray, template: string) : object {
        if (results === null) throw new Error('cannot map null matches');
        let map: RegexMap = { fullMatch: results[0] };

        const tGroups = template.match(/(?<=\()\w+(?=\))/g);
        if (!tGroups) return map;

        tGroups.unshift('fullMatch');

        for (let i = 0; i < results.length; ++i) {
            const key = tGroups[i];
            map[key] = results[i];
        }

        return map;
    }
}