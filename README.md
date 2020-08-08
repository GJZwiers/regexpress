RegExpress builds regex patterns from JavaScript objects using templates.

### Installation
The package should run without dependencies in Node v13+. In older versions you may need `esm` or something similar to handle ES6 modules.

### Import
After installing import the module to any `.js` file.
```javascript
import { Regexpress } from 'regexpress';
```

Create an instance of the Regexpress class after which you can use its functions:
### Initialization
```javascript
const rxp = new Regexpress();
```

### Usage
Declare an object with the pattern's values and second one with a template that describes the pattern structure. arrays of values will be concatenated with `|` by default.

```javascript
const regexData = {
    volume: String.Raw`\d{1,4}`,
    unit: ['ml', 'cl', 'l']
};

const settings = {
    template: '(volume) (unit)',
    flags: 'i'
};

const regex = rxp.buildRegex(regexData, settings);
```

The above objects build the pattern `/(\d{1,4}) (ml|cl|l)/i` by replacing the names in the template with the corresponding key in the values object, one by one. Next, the regex string is compiled and given the specified flag(s).

```javascript
'(volume) (unit)' -> '(\\d{1,4}) (unit)'
'(\\d{1,4}) (unit)' -> '(\\d{1,4}) (ml|cl|l)'
```
```javascript
'(\\d{1,4}) (ml|cl|l)' -> /(\d{1,4}) (ml|cl|l)/i
```

Defining a custom separator is possible by including a `separator` key in the settings object:

```javascript
const settings = {
    template: 'keywords',
    separator: '.+'
};

const regexData = {
    keywords: ['one', 'two', 'three']
};

const regex = rxp.buildRegex(regexData, settings); -> /one.+two.+three/
```

RegExpress can be helpful when you want to match data that has a high variety of different notations with similar meaning. Suppose you want to match volume data which can come as either a single value, a min-max range or a limit value (e.g. > 100). With RegExpress you can declare a list of templates for each of these:

 ```javascript
    const settings = {
            templateList: [
            '(volume) (unit)[- ]+(volume) (unit)',  // Range
            '[>< ]+(volume) (unit)',                // Limit
            '(volume) (unit)',                      // Single
            ],
            flags: 'i'
    };

    const regexData = {
        volume: '\\d{1,4}',
        unit: ['ml', 'cl', 'l'],
    };

    const regexes = rxp.buildRegexes(regexData, settings);

    /* 
    Will build array of patterns: [
        /(\d{1,4})(ml|cl|l)[- ]+(\d{1,4})(ml|cl|l)/i,
        /[>< ]+(\d{1,4})(ml|cl|l)/i,
        /(\d{1,4})(ml|cl|l)/i 
    ] 
    */
```

Any pattern built with RegExpress contains the template as a property and can be used to map an array of matches to an object, with the template names as keys:

```javascript
const volumeData = '100 ml';
// regex: /(\d{1,4}) (ml|cl|l)/i, template: '(volume) (unit)'

const matches = volumeData.match(regex);
// matches: [ '100 ml', '100', 'ml']

const map = rxp.mapTemplate(matches, regex.getTemplate()); 
// map: { fullMatch: '100 ml', volume: '100', unit: 'ml' }
```

Reusing regex groups in a number of patterns can be done by declaring them in a separate object and adding placeholders where you want to insert them in the regex values.

The example below reuses components for day, month and year in both an expiry date as well as a calendar date:

 ```javascript
    const substitutes = {
        day: '[0-3][0-9]',
        month:  ['jan','feb','mar','apr','may','jun',
                'jul','aug','sep','okt','nov','dec'],
        year: '(?:19|20)\\d{2}'
    }
    
    const productExpirationDate = {
        expire_statement: ['best before', 'best quality up until', 'use before'],
        day: '~~day~~',
        month: '~~month~~',
        year: '~~year~~'
    }
    
    const ExpirationDateSettings = {
        template: '(?:expire_statement): (day)-(month)-(year)',
        flags: ''
    }
    
    const calendarDate = {
        day: '~~day~~',
        month: '~~month~~',
        year: '~~year~~'
    }
    
    const calendarDateSettings = {
        templateList: [
        '(day)-(month)-(year)',
        '(month)-(day)-(year)'
        ],
        flags: ''
    }

```
