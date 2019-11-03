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

class RegexJSONBuilder {
    private json: any;
    private regexes: Array<RegExp> = [];
    private phSubs: PlaceholderSubstitutes = {};

    constructor(json: object) {
        this.json = json;
    }

    buildField(field: string) {
        let regexData = this.json[field];
    }

    

}


const jsonSample = {
    fieldTwo: {
        settings: {
            template: "(volume)(units)",
            flags: "i"
        },
        volume: [
            'v1',
            'v2',
            'v3'
        ],
        units: [
            'l1',
            'l2'
        ]
    }
}