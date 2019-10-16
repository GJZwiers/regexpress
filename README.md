RegExpress is a TypeScript/JavaScript library for writing extensive regex patterns in a more organised and maintainable way. Large patterns can be structured in user-defined components and arranged using a template string. It has functionality somewhat similar to named capturing groups in other regex flavours.

Usage:

```javascript
    import { Regexpress } from 'regexpress';

    // Create an instance, optionally pass an object with substitute values for placeholders
    const list_of_substitute_values = {
        substitutes: [
            's1',
            's2',
            's3'
        ]
    }

    const rgxBuilder = new Regexpress(list_of_substitute_values);

    // Get some regex data, this can be in any form that is a valid Javascript object (JSON, object literal, mongoDB schema, etc.).
    const exampleData = {
        settings: {
            template: 'values',
            flags: 'g'
        },
        values: [
            '1',
            '~~substitutes~~',  // placeholders are declared with ~~somename~~ and substituted with values from the list given earlier
            '2',
            '3'
        ]
    };

    // Call the buildRegex method with the regex data as argument
    const regex = rgxBuilder.buildRegex(exampleData);

    /*
    Placeholders will be substituted, and all the declared fields other than settings are built (arrays are joined with |, strings stay as is) and inserted at the right spot in the template string:

    -> substitution: values: [ '1', 's1', 's2', 's3', '2', '3' ]
    -> array join with |: values: '1|s1|s2|s3|2|3'
    -> template insertion: 'values' -> '1|s1|s2|s3|2|3'

    With multiple template groups it is possible to make more complex arrangements

    Finally, regex construction takes place with the flags stated in settings: /1|s1|s2|s3|2|3/g
    /*
```

Regexes can be defined from JSON or as object literals at runtime by declaring a settings object and at least one group of search terms:

```javascript
{
    "settings": {
        "template": "values"
        "flags": "i"
    },
    "values": [
        'v1',
        'v2',
        'v3'
    ]
}
```

Arrays will be compiled to regex alternates, the above values array becomes: "v1|v2|v3"

Capturing groups and non-capturing ones are used to delineate parts of the regex top-level using the template string:
```javascript
{
    "settings": {
        "template": "(?:field_name): (field_values)",
        "flags": ""
    }
    "field_name": [
        "notation_one",
        "notation_two",
        "..."
    ],
    "field_values": [
        "v1",
        "v2",
        "..."
    ]
}
```
Similarly, groups of regex lookaheads can be defined:
```javascript
{
    "settings": {
        "template": "(?:field_name): (field_values)(?=lookahead_values)",
        "flags": ""
    }
    "field_name": [
        "notation_one",
        "notation_two",
        "..."
    ],
    "field_values": [
        "v1",
        "v2",
        "..."
    ],
    "lookahead_values": [
        "l1",
        "l2",
        "..."
    ]
}
```
Regexpress allows you to use placeholders as well to use common values in multiple regex patterns, by using double tilde (~) syntax:
```javascript
{
    "commonly_used_values": [
        "1",
        "2",
        "3"
    ]
}

{
    "settings": {
        "template": "(?:field_name): (field_values)",
        "flags": ""
    }
    "field_name": [
        "notation_one",
        "notation_two",
        "..."
    ],
    "field_values": [
        "~~commonly_used_values~~",
        "v1",
        "v2",
        "v3"
    ]
}
```