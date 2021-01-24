import { expect } from 'chai';
import { ExtendedRegExp } from "./ExtendedRegExp";

describe("ExtendedRegExp", () => {
    it("should allow access to RegExp property", () => {
        let xregex = new ExtendedRegExp(/bar/, 'foo');
        expect(xregex.global).to.equal(false);
    });
    it("should allow access to RegExp method", () => {
        let xregex = new ExtendedRegExp(/bar/, 'foo');
        expect(xregex.test('bar')).to.equal(true);
    });
    it("should map matches with no capturing groups", () => {
        let xregex = new ExtendedRegExp(/bar/, 'foo');
        let map = xregex.map(['bar']);
        expect(map).to.eql({full_match: 'bar'});
    });
    it("should map matches with capturing groups", () => {
        let xregex = new ExtendedRegExp(/(bar)/, '(foo)');
        let map = xregex.map(['bar', 'bar']);
        expect(map).to.eql({full_match: 'bar', foo: 'bar'});
    });
    it("should map matches with nested capturing groups (single tier)", () => {
        let xregex = new ExtendedRegExp(/(bar(foo))/, '(foo(bar))');
        let map = xregex.map(['barfoo', 'barfoo', 'foo']);
        expect(map).to.eql({full_match: 'barfoo', foo: 'barfoo', bar: 'foo'});
    
        let xregex2 = new ExtendedRegExp(/((foo)bar)/, '((bar)foo)');
        let map2 = xregex2.map(['foobar', 'foobar', 'foo']);
        expect(map2).to.eql({full_match: 'foobar', bar: 'foobar', foo: 'foo'});
    
        let xregex3 = new ExtendedRegExp(/((foo)bar)(baz)/, '((bar)foo)(baz)');
        let map3 = xregex3.map(['foobarbaz', 'foobar', 'foo', 'baz']);
        expect(map3).to.eql({full_match: 'foobarbaz', bar: 'foobar', foo: 'foo', baz: 'baz'});
    });
});

