Regexpress enables construction of regex patterns using template strings. Templates can be built
piece by piece or by declaring objects with regex settings and values. 

Example (piece by piece construction):

```javascript
    import { RegexBuilder } from 'regexpress';

    const builder = new RegexBuilder();
    const regex = builder.addGroup('(values)', ['a', 'b', 'c'])
                        .add('separatorChars', '[: ]+')
                        .addGroup('(?=lookaheads)', ['d', 'e'])
                        .setFlags('g')
                        .build();
```
The above creates the template string "(values)separatorChars(?=lookaheads)"
and keeps a list of group names and values. The regex is built
by substituting the group names in the template with the corresponding group values.

String arrays are joined by default with pipe '|' symbols
to make alternates: 
```javascript
['a', 'b', 'c'] -> 'a|b|c'
```
The template string:
```javascript
"(values)separatorChars(?=lookaheads)"
```
thus becomes:
```javascript
"(a|b|c)[: ]+(?=d|e)"
```
This string is then compiled to regex
with the specified flag(s):
```javascript
/(a|b|c)[: ]+(?=d|e)/g
```

Example (predefined data)
```javascript
    import { RegexJSONBuilder } from 'regexpress';

    const regexData = {
        settings: {
            template: '(values)separatorChars(?=lookaheads)',
            flags: 'g'
        },
        values: ['a','b','c'],
        separatorChars: '[: ]+',
        lookaheads: ['d', 'e']
    }

    const builder = new RegexJSONBuilder();
    const regex = builder.build(regexData);
```

In order to map arrays of matches to an object with the fields being your pattern's groups, use the template mapper:

```javascript
    import { RegexBuilder, TemplateGroupMapper } from 'regexpress';

    const builder = new RegexBuilder();
    const regex = builder.add('start', 'full_')
                        .addGroup('(end)', ['match']) // creates template string: 'start(end)'
                        .build();

    const text = 'full_match';
    const matches = text.match(regex);  

    // converts matches array ['full_match', 'match'] to { fullMatch: 'full_match', end: 'match'}
    const mappedMatches = TemplateGroupMapper.map(matches, builder.getTemplate());
```

To run a file with some regexpress code from the command line, try the following (requires Node.js v1.6+)
```console
node -r esm filename.js
```

Planned additions :

* creating an object of commonly used groups and the ability to 
  insert them into multiple patterns with placeholder text

(to be implemented)
 ```javascript
    import { RegexJSONBuilder } from 'regexpress';

    const subs = {
        day: '\d{1,2}',
        month: '\d{1,2}|\w+',
        year: '\d{4}'
    }

    const builder = new RegexJSONBuilder(subs);
    const regex = builder.build(fieldOne);

    const euDate = {
        settings: {
            template: '(day)-(month)-(year)'
            flags: ''
        },
        day: '~~day~~',
        month: '~~month~~',
        year: '~~year~~'
    }

    // creates pattern: /(\d{1,2})-(\d{1,2|\w+)-(\d{4})/

    const usDate = {
        settings: {
            template: '(month)-(day)-(year)'
            flags: ''
        },
        day: '~~day~~',
        month: '~~month~~',
        year: '~~year~~'
    }

    // creates pattern: /(\d{1,2|\w+)-(\d{1,2})-(\d{4})/

```

* support for arrays of templates containing different group configurations:
(to be implemented)
 ```javascript
    import { RegexListBuilder } from 'regexpress';

    const subs = {
        volume: '\d{1,4}',
        unit: '[mcd]l'
    }

    const regexData = {
        settings: {
            templateList: [
            '(volume)(unit)',
            '[>< ]+(volume)(unit)'
            '(volume)(unit)[- ]+(volume)(unit)'
            ],
            flags: 'i'
        },
        volume: '~~volume~~',
        unit: '~~unit~~',
    }

    const builder = new RegexListBuilder();
    const regexes = builder.build(regexData);
```


