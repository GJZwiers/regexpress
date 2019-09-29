RegExpress is a TypeScript/JavaScript library for writing extensive regex patterns in a more organised and maintainable way. Large patterns can be structured in user-defined components and arranged using a template string. It has functionality somewhat similar to named capturing groups in other regex flavours.

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
Similarly, groups of regex lookeheads can be defined:
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
Regexpress allows you to use placeholders as well to use common values in multiple regex patterns, by using the "~~placeholder~~" syntax:
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