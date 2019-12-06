import { TemplateBuilder } from '../src/index';

import * as mocha from  'mocha';
import * as chai from 'chai';

const expect = chai.expect;

const mockRegexData = {
    values: [
        '1',
        '2'
    ]
};

const mockSettings = {
    template: '(values)',
    flags: ''
};

const mockRegexDataMulti = {
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

const settingsMulti = {
    template: '(one)(two)(three)',
    flags: ''
};


const mockPlaceholder = {
    placeholder: ['p1', 'p2', 'p3']
}

const mockRegexDataWithNoPlaceholder = {
    values: [
        '1',
        '2'
    ]
};

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

describe('regex builder logic tests', () => {

    it('should be possible to instantiate without passing any placeholders', () => {
        expect(new TemplateBuilder(mockRegexDataWithNoPlaceholder, mockSettings).build())
            .to.deep.equal(/(1|2)/);
    });

    it('should create regex /(1|2)/ from template "(values)" and object { values: ["1", "2"] }', () => {
        expect(new TemplateBuilder(mockRegexData, mockSettings).build())
            .to.deep.equal(/(1|2)/);
    });

    it('should arrange template groups properly: template (one)(two)(three) => /(1|2)(2|3)(3|4)/', () => {
        expect(new TemplateBuilder(mockRegexDataMulti, settingsMulti).build())
            .to.deep.equal(/(1|2)(2|3)(3|4)/);
    });
    
    it('should substitute a placeholder with syntax ~~name~~ wih the correct values', () => {
        expect(new TemplateBuilder(mockRegexDataWithPlaceholder, mockSettings, mockPlaceholder).build())
            .to.deep.equal(/(p1|p2|p3|1|2)/)
    });

    it('should throw an error when an undefined placeholder is encountered', () => {
        expect(() => new TemplateBuilder(mockRegexDataWithUndefinedPlaceholder, mockSettings, mockPlaceholder).build())
            .to.throw('found undefined placeholder ~~holdplacer~~ in regex data');
    });
  
});
