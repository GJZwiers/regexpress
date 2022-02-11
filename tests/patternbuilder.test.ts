import { expect, describe, it } from '@jest/globals';

import { Pattern } from '../src/patternbuilder/pattern'
import { ExtendedRegExp } from '../src/extended-regexp/extended_regexp';

describe('PatternBuilder', () => {
    it("should build a pattern from template and data correctly", () => {
        let pattern = Pattern.new().settings({ template: 'foo' }).vars({foo: 'bar'}).build();
        expect(pattern).toStrictEqual(new ExtendedRegExp(/bar/, 'foo', false));
        expect(pattern.test('bar')).toEqual(true);
    });
    it("should add an exception group correctly", () => {
        let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .filter(['baz'])
        .build();
    
        expect(pattern).toStrictEqual(new ExtendedRegExp(/baz|(bar)/, 'filter|(foo)', false));
    });
    it("should add a wildcard group correctly", () => {
        let pattern = Pattern.new()
        .settings({template: 'foo'})
        .vars({foo: 'bar'})
        .wildcard('b.*')
        .build();

        expect(pattern).toStrictEqual(new ExtendedRegExp(/bar|(b.*)/, 'foo|(wildcard)', false));
    });  
});