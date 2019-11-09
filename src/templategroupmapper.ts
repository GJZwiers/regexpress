interface RegexMap {
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