import { RegexBuilder } from "../src/RegexBuilder";

const mockRegexData = {
    settings: {
        template: '(values)',
        flags: ''
    },
    values: [
        '1',
        '2'
    ]
};

const mockRegexDataWithSubs = {
    settings: {
        template: '(values)',
        flags: ''
    },
    values: [
        '~~test_placeholder~~',
        '1',
        '2'
    ]
};

const mockPlaceholderSubs = {
    test_placeholder: [
        "sub1",
        "sub2"
    ]
};


test('Regexpress builds pattern correctly from json notation', () => {
    let rb = new RegexBuilder(mockPlaceholderSubs);

    expect(rb.buildRegex(mockRegexData)).toEqual(/(1|2)/);
});

test('RegExpress substitutes placeholder with corresponding group of substitutes', () => {
    let rb = new RegexBuilder(mockPlaceholderSubs);

    expect(rb.buildRegex(mockRegexDataWithSubs)).toEqual(/(sub1|sub2|1|2)/);
});