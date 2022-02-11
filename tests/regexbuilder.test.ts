import { expect, describe, it } from '@jest/globals';
import { Regex } from '../src/regexbuilder/regex';

describe('RegexBuilder', () => {
    it('should adds any group other than named group correctly with group()', () => {
        expect(Regex.new().group('foo', 'cg').build()).toStrictEqual(/(foo)/);
        expect(Regex.new().group('foo', 'ncg').build()).toStrictEqual(/(?:foo)/);
        expect(Regex.new().group('foo', 'la').build()).toStrictEqual(/(?=foo)/);
        expect(Regex.new().group('foo', 'lb').build()).toStrictEqual(/(?<=foo)/);
        expect(Regex.new().group('foo', 'nla').build()).toStrictEqual(/(?!foo)/);
        expect(Regex.new().group('foo', 'nlb').build()).toStrictEqual(/(?<!foo)/);
    });
    it("should add a capturing group correctly with capturing()", () => {
        expect(Regex.new().capture('foo').build()).toStrictEqual(/(foo)/);
    });
    it("should add named group correctly", () => {
        expect(Regex.new().namedCapture('bar', 'foo').build()).toStrictEqual(/(?<bar>foo)/);
    });
    it("should compile a build to a pattern correctly", () => {
        expect(Regex.new().add('foo').build()).toStrictEqual(/foo/);
    });
    it("should throw when building an invalid pattern", () => {
        expect(() => {
            return Regex.new().add('(foo').build();
        }).toThrow();
    });
    it("should add flags correctly", () => {
        expect(Regex.new().add('foo').flags('gi').build()).toStrictEqual(/foo/gi);
    });
});