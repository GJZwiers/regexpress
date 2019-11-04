Regexpress enables JavaScript developers to build extensive regexes in a more organised manner. Patterns are created from a template string of user-defined groups and matches can be mapped to declarative objects and accessed by group name instead of index number.

Usage:

```javascript
    import { RegexBuilder } from 'regexpress';

    const builder = new RegexBuilder();
    const regex = builder.addGroup('(values)', ['a', 'b', 'c'])
                        .add('separators', '[: ]+')
                        .addGroup('(?=lookaheads)', ['d', 'e'])
                        .setFlags('g')
                        .build();
    
    /*
    This builds a regex from the following template string:
    "(values)separators(?=lookaheads)" by replacing the 
    names in the template with the corresponding named group
     
    The above results in: /(a|b|c)[: ]+(?=d|e)/g

    Arrays of strings are joined by default to a string of alternates: ['a', 'b', 'c'] -> a|b|c
    */
```


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

This package uses the esm module for es6 module support in Node.js.

Use the following command to run an index.js file with some regexpress code:
```console
node -r esm index.js
```

Planned additions:

- support for building from JSON and other data formats
- ability to substitute placeholders for commonly occurring groups of values
- support for arrays of templates containing different group configurations

This package is in early development and is being written in TypeScript. Improvement suggestions and issue notifications are very welcome.