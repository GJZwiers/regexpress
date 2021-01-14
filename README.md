# RegExpress
This package builds regex patterns from JavaScript objects using templates. 

## Installation
Make sure `npm` is installed, then change into your project directory and run `npm install regexpress`.

The package runs without dependencies in Node v13.2.0+. In older versions you may need to run with the `--experimental-modules` flag or another package to handle ES6 modules.

## Import
After installing import the module:
```javascript
import { Regexpress } from 'regexpress';
```

## Initialization
Create an instance of the Regexpress class after which you can use its functions:
```javascript
const rxp = new RegExpress();
```

## Basic Usage
Declare an object with `template` and `flags` properties, then create an object for the actual pattern values stored under the same names as in the template:
```javascript
const settings = {
    template: '(volume) (unit)',
    flags: 'i'
};

const regexData = {
    volume: String.Raw`\d{1,4}`,
    unit: ['ml', 'cl', 'L']
};

const regex = rxp.build(regexData, settings);
```


The above objects build the pattern `/(\d{1,4}) (ml|cl|l)/i` in the following steps:  
1. Replace the template names with the right values:
```javascript
'(volume) (unit)' -> '(\\d{1,4}) (unit)'
'(\\d{1,4}) (unit)' -> '(\\d{1,4}) (ml|cl|l)'
```
2. Compile the string to regex: `'(\\d{1,4}) (ml|cl|l)' -> /(\d{1,4})(ml|cl|l)/i`


You can also declare a list of templates. This can be helpful to match data that comes in a high variety of different notations with similar meaning. Suppose you want to match volume data which can come as either a single value (100), a min-max range (10-100) or a limit value (<100). With RegExpress you can declare a template for each of these:

 ```javascript
    const settings = {
            template: [
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

    const regexes = rxp.build(regexData, settings);
    /* 
    Will build array of patterns: [
        /(\d{1,4})(ml|cl|l)[- ]+(\d{1,4})(ml|cl|l)/i,
        /[>< ]+(\d{1,4})(ml|cl|l)/i,
        /(\d{1,4})(ml|cl|l)/i 
    ] 
    */
```

## Mapping Matches
Patterns built with RegExpress contains their template as a property and can be used to map any match results to an object, containing the template names as keys:

```javascript
// regex: /(\d{1,4}) (ml|cl|l)/i, template: '(volume) (unit)'
const volumeData = '100 ml';

const matches = volumeData.match(regex);
// matches: [ '100 ml', '100', 'ml']

const map = rxp.mapTemplate(matches, regex.getTemplate()); 
// map: { fullMatch: '100 ml', volume: '100', unit: 'ml' }
```

## Placeholders
To reuse template values in a number of patterns you can store them in a special object and add placeholders at the places you want them to be inserted in any pattern.

The example below reuses components for `day`, `month` and `year` in both an expiry date as well as a calendar date:

 ```javascript
    const subs = {
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
        template: [
        '(day)-(month)-(year)',
        '(month)-(day)-(year)'
        ],
        flags: ''
    }
```

## Settings
Defining a custom separator is possible by adding a `separator` key to the settings:

```javascript
const settings = {
    template: 'keywords',
    separator: '.+'
};

const regexData = {
    keywords: ['one', 'two', 'three']
};

const regex = rxp.build(regexData, settings); -> /one.+two.+three/
```

It is possible to sort the arrays with the regex values, analyzing the maximum length of the string they might match and sorting the alternates in ascending order. This is experimental and only works when using the `|` as separator:
```javascript
const settings = {
    template: 'keywords',
    autosort: true
}
```
