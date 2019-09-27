import { RegexBuilder } from "../src/RegexBuilder";

const mockRegexData = {
    settings: {
        template: '(values)',
        flags: ''
    },
    values: ['1', '2']
}

const mockPlaceholderSubs = {
    "testPlaceholder": [
        "testVal",
        "testVal2"
    ]
}

test('sample test', () => {
    let rb = new RegexBuilder(mockRegexData, mockPlaceholderSubs);
    expect(rb.buildRegex(mockRegexData)).toBe(/(1|2)/);
});