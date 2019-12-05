import { RegexJSONBuilder, NRegexBuilder } from '../src/index';

import * as mocha from  'mocha';
import * as chai from 'chai';

const expect = chai.expect;

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

const mockRegexDataMulti = {
    settings: {
        template: '(one)(two)(three)',
        flags: ''
    },
    one: [
        '1',
        '2'
    ],
    two: [
        '2',
        '3'
    ],
    three: [
        '3',
        '4'
    ]
};

const mockPlaceholder = {
    placeholder: ['p1', 'p2', 'p3']
}

const mockRegexDataWithPlaceholder = {
    values: [
        '~~placeholder~~',
        '1',
        '2'
    ]
};

const mockRegexDataWithUndefinedPlaceholder = {
    values: [
        '~~holdplacer~~',
        '1',
        '2'
    ]
};

const mockSettings = {
    template: '(values)',
    flags: ''
};


describe('Regex JSON Builder tests', () => {

    it('Should create regex /(1|2)/ from template "(values)" and object { values: ["1", "2"] }', () => {
        expect(new RegexJSONBuilder().build(mockRegexData))
            .to.deep.equal(/(1|2)/);
    });

    it('Should arrange template groups properly: template (one)(two)(three) => /(1|2)(2|3)(3|4)/', () => {
        expect(new RegexJSONBuilder().build(mockRegexDataMulti))
            .to.deep.equal(/(1|2)(2|3)(3|4)/);
    });
    
    it('Should substitute a placeholder with syntax ~~name~~ wih the correct values', () => {
        expect(new NRegexBuilder(mockRegexDataWithPlaceholder, mockSettings, mockPlaceholder).build())
            .to.deep.equal(/(p1|p2|p3|1|2)/)
    });

    it('Should throw an error when an undefined placeholder is encountered', () => {
        expect(() => new NRegexBuilder(mockRegexDataWithUndefinedPlaceholder, mockSettings, mockPlaceholder).build())
            .to.throw('found undefined placeholder ~~holdplacer~~ in regex data');
    });
  
  });
