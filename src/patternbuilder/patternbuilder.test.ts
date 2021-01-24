import { expect } from 'chai';
import { Pattern } from './Pattern'
import { ExtendedRegExp } from '../extended-regexp/ExtendedRegExp';

describe('PatternBuilder', () => {
    it("should build a pattern from template and data correctly", () => {
        let pattern = Pattern.new().settings({ template: 'foo' }).data({foo: 'bar'}).build();
        expect(pattern).to.eql([new ExtendedRegExp(/bar/, 'foo')]);
        expect(pattern[0].test('bar')).to.equal(true);
    });
    it("should add an exception group correctly", () => {
        let pattern = Pattern.new()
        .settings({template: 'foo'})
        .data({foo: 'bar'})
        .except(['baz'])
        .build()
    
        expect(pattern).to.eql([new ExtendedRegExp(/baz|(bar)/, 'exclude|(foo)')]);
    });
    it("should add a wildcard group correctly", () => {
        let pattern = Pattern.new()
        .settings({template: 'foo'})
        .data({foo: 'bar'})
        .wildcard('b.*')
        .build()
        expect(pattern).to.eql([new ExtendedRegExp(/bar|(b.*)/, 'foo|(wildcard)')]);
    });  
});
