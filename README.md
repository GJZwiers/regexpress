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
    This builds a regex from the following template string: "(values)separators(?=lookaheads)" by replacing
    the names in the template with the corresponding named group
     
    The above results in: /(a|b|c)[: ]+(?=d|e)/g

    Arrays of strings are joined by default to a string of regex alternates: ['a', 'b', 'c'] -> a|b|c

    If you want a different way of accessing the capturing groups in the matches you can call the map method
    of the TemplateGroupMapper class to change matches to 
    { fullMatch: ..., values: ... }

    */

    const mappedMatches = TemplateGroupMapper.map(matches, builder.getTemplate());

```

Planned additions:

- support for building from JSON and other data formats
- ability to substitute placeholders for commonly occurring groups of values
- support for arrays of templates containing different group configurations

This package is in early development and is being written in TypeScript. Suggestions for improvement or identification of problems are very welcome.