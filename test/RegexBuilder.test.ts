// import { expect } from 'chai';
// import { assert } from 'chai';
// import { RegExpress } from '../src/regexpress';
// import { TemplateMaker, AutoSorter } from '../src/index';
// import { DefaultSpecification } from '../src/templatebuilder';

// const mockRegexData = {
//     values: [
//         '1',
//         '2'
//     ]
// };

// const mockSettings = {
//     template: ['(values)'],
//     flags: ''
// };

// const mockRegexDataMulti = {
//     one: [
//         '1',
//         '2'
//     ],
//     two: [
//         '2',
//         '3'
//     ],
//     three: [
//         '3',
//         '4'
//     ]
// };

// const settingsMulti = {
//     template: ['(one)(two)(three)'],
//     flags: ''
// };


// const mockPlaceholder = {
//     placeholder: ['p1', 'p2', 'p3']
// }

// const mockRegexDataWithNoPlaceholder = {
//     values: [
//         '1',
//         '2'
//     ]
// };

// const mockRegexDataWithPlaceholder = {
//     values: [
//         '~~placeholder~~',
//         '1',
//         '2'
//     ]
// };

// const mockRegexDataWithUndefinedPlaceholder = {
//     values: [
//         '~~holdplacer~~',
//         '1',
//         '2'
//     ]
// };

// describe('TemplateMaker', () => {
//     it('Should not throw when given no placeholders', () => {
//         expect(() => { new TemplateMaker(
//             new DefaultSpecification(mockRegexDataWithNoPlaceholder, mockSettings))
//             .build(mockSettings.template, mockSettings.flags)})
//             .to.not.throw();
//     });
//     it('Should create regex /(1|2)/ from template "(values)" and object { values: ["1", "2"] }', () => {
//         const patterns = new TemplateMaker(new DefaultSpecification(mockRegexData, mockSettings))
//             .build(mockSettings.template, mockSettings.flags);

//         expect(patterns.length).to.be.above(0);
//         const elt = patterns[0];
//         assert.equal(elt instanceof RegExp, true);
//         expect(elt).to.haveOwnProperty('_template');
//     });
//     it('Should arrange template groups properly: template (one)(two)(three) => /(1|2)(2|3)(3|4)/', () => {
//         const patterns = new TemplateMaker(new DefaultSpecification(mockRegexDataMulti, settingsMulti))
//             .build(settingsMulti.template, settingsMulti.flags)
        
//         expect(patterns.length).to.be.above(0);
//         expect(patterns[0]).to.deep.equal(/(1|2)(2|3)(3|4)/);
//     });
//     it('should substitute a placeholder with syntax ~~name~~ wih the correct values', () => {
//         const patterns = new TemplateMaker(new DefaultSpecification(mockRegexDataWithPlaceholder, mockSettings, mockPlaceholder))
//             .build(mockSettings.template, mockSettings.flags);

//         expect(patterns.length).to.be.above(0);
//         expect(patterns[0]).to.deep.equal(/(p1|p2|p3|1|2)/);
//     });
//     it('Should throw an error when an undefined placeholder is encountered', () => {
//         expect(() => new TemplateMaker(new DefaultSpecification(mockRegexDataWithUndefinedPlaceholder, mockSettings, mockPlaceholder))
//             .build(mockSettings.template, mockSettings.flags))
//             .to.throw('undefined placeholder ~~holdplacer~~ in regex data');
//     });
// });

// const regexDataAutoSortMock = {
//     Quantifiers: [
//         'a{1}',
//         'a{3}fb*c{1,10}'
//     ]
// };

// const autoSortSettingTrueMock = {
//     template: '(Quantifiers)',
//     flags: '',
//     autosort: true,
//     separator: '|'
// };

// const autoSortSettingFalseMock = {
//     template: '(Quantifiers)',
//     flags: '',
//     autosort: false,
//     separator: '|'
// };

// describe('autosorter tests', () => {
    
//     it('Should not sort from data with autosort setting = false', () => {
//         expect(new RegExpress().buildRegex(regexDataAutoSortMock, autoSortSettingFalseMock))
//             .to.deep.equal(/(a{1}|a{3}fb*c{1,10})/);
//     });

//     it('Should sort from data with autosort setting = true', () => {
//         expect(new RegExpress().buildRegex(regexDataAutoSortMock, autoSortSettingTrueMock))
//             .to.deep.equal(/(a{3}fb*c{1,10}|a{1})/);
//     });

//     it('Should sort from code after direct call to autoSort method', () => {
//         expect(new AutoSorter(regexDataAutoSortMock).autoSort())
//             .to.deep.equal({ Quantifiers: [
//             'a{3}fb*c{1,10}',
//             'a{1}'
//         ]});
//     });
  
// });
