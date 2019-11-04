// import { RegexBuilder } from "../src/index";

// const mockRegexData = {
//     settings: {
//         template: '(values)',
//         flags: ''
//     },
//     values: [
//         '1',
//         '2'
//     ]
// };

// test('Regexpress correctly builds a pattern from json', () => {
//     let rb = new RegexBuilder(mockPlaceholderSubs);

//     expect(rb.buildRegex(mockRegexData)).toEqual(/(1|2)/);
// });

// const mockRegexDataMultiGroup = {
//     settings: {
//         template: '(group_one)(group_two)',
//         flags: ''
//     },
//     group_one: [
//         '11',
//         '12'
//     ],
//     group_two: [
//         '21',
//         '22'
//     ]
// };

// test('Regexpress correctly arranges groups using the template string', () => {
//     let rb = new RegexBuilder(mockPlaceholderSubs);

//     expect(rb.buildRegex(mockRegexDataMultiGroup)).toEqual(/(11|12)(21|22)/);
// });

// const mockRegexDataWithSubs = {
//     settings: {
//         template: '(values)',
//         flags: ''
//     },
//     values: [
//         '~~test_placeholder~~',
//         '1',
//         '2'
//     ]
// };

// const mockPlaceholderSubs = {
//     test_placeholder: [
//         "sub1",
//         "sub2"
//     ]
// };

// test('RegExpress correctly substitutes a placeholder with the corresponding substitutes', () => {
//     let rb = new RegexBuilder(mockPlaceholderSubs);

//     expect(rb.buildRegex(mockRegexDataWithSubs)).toEqual(/(sub1|sub2|1|2)/);
// });

// const mockRegexDataGlobal = {
//     settings: {
//         template: '(values)',
//         flags: 'g'
//     },
//     values: [
//         '1',
//         '2'
//     ]
// };

// test('RegExpress correctly adds a global flag when specified in the settings object', () => {
//     let rb = new RegexBuilder(mockPlaceholderSubs);

//     expect(rb.buildRegex(mockRegexDataGlobal)).toEqual(/(1|2)/g);
// });

// const mockRegexDataTwo = {
//     settings: {
//         template: '(?:field_name)[: ]+(field_values)',
//         flags: ''
//     },
//     field_name: [
//         'n1',
//         'n2'
//     ],
//     field_values: [
//         'v1',
//         'v2'
//     ]
// };

// test('RegExpress correctly leaves non-array groups just the way they are', () => {
//     let rb = new RegexBuilder(mockPlaceholderSubs);

//     expect(rb.buildRegex(mockRegexDataTwo)).toEqual(/(?:n1|n2)[: ]+(v1|v2)/);
// });

