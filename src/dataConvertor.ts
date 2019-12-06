const fs = require('fs');
const yaml = require('js-yaml');

class RegexDataConvertor {

    constructor() {}

    async fromJSON(path: string) {
        const file = await fetch(path);
        const data = await file.json();
    }

    async fromYAML(path: string) {
        const file = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    }

    async fromCSV(path: string) {
        const file = await fetch(path);
        const data = await file.text();
    }

}