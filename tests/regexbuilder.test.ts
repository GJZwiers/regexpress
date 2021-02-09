import { expect } from 'chai';
import { Regex } from '../src/regexbuilder/regex';

describe('RegexBuilder', () => {
    it('should adds any group other than named group correctly with group()', () => {
        expect(Regex.new().group('foo', 'cg').build()).to.eql(/(foo)/);
        expect(Regex.new().group('foo', 'ncg').build()).to.eql(/(?:foo)/);
        expect(Regex.new().group('foo', 'la').build()).to.eql(/(?=foo)/);
        expect(Regex.new().group('foo', 'lb').build()).to.eql(/(?<=foo)/);
        expect(Regex.new().group('foo', 'nla').build()).to.eql(/(?!foo)/);
        expect(Regex.new().group('foo', 'nlb').build()).to.eql(/(?<!foo)/);
    });
    it("should add a capturing group correctly with capturing()", () => {
        expect(Regex.new().capture('foo').build()).to.eql(/(foo)/);
    });
    it("should add named group correctly", () => {
        expect(Regex.new().namedCapture('bar', 'foo').build()).to.eql(/(?<bar>foo)/);
    });
    it("should compile a build to a pattern correctly", () => {
        expect(Regex.new().add('foo').build()).to.eql(/foo/);
    });
    it("should throw when building an invalid pattern", () => {
        expect(() => {
            return Regex.new().add('(foo').build();
        }).to.throw();
    });
    it("should add flags correctly", () => {
        expect(Regex.new().add('foo').flags('gi').build()).to.eq;(/foo/gi);
    });
});