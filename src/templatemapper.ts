interface RegexMap {
    [key: string]: string
}

//todo: add setting map: true/false

export class TemplateMapper {
    static map(results: RegExpMatchArray | null, template: string) : object {
        if (results === null) throw new Error('No match results found to map');
        if (/\((\w+)\).+\1\W/.test(template)) throw new Error('identical name in template string');
        
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
