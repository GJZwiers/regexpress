import { expect } from 'chai';
import { DefaultSpecification } from "../src/template-spec/template_specification";

describe("DefaultSpecification", () => {
    it("should build a template from data correctly", () => {
        const specdata = {
            settings: { template: 'foo' },
            vars: { foo: 'bar' }
        }
        const spec = new DefaultSpecification(specdata);
        expect(spec.compose(specdata.settings.template)).to.equal('bar');
    });
    it("should join arrays correctly", () => {
        const specdata = {
            settings: { template: 'foo' },
            vars: { foo: ['bar', 'baz'] }
        }
        expect(new DefaultSpecification(specdata)
        .compose(specdata.settings.template)).to.equal('bar|baz');
    });
    it("should substitute placeholders correctly", () => {
        const specdata = {
            settings: { template: 'foo' },
            vars: { foo: ['{{bar}}', 'baz'] },
            placeholders: { bar: [ 'bar']}
        }
        expect(new DefaultSpecification(specdata)
        .compose(specdata.settings.template)).to.equal('bar|baz');
    });
    it("should handle a custom separator correctly", () => {
        const specdata = {
            settings: { template: 'foo', separator: '[: ]+' },
            vars: { foo: ['bar', 'baz'] }
        }
        expect(new DefaultSpecification(specdata)
        .compose(specdata.settings.template)).to.equal('bar[: ]+baz');
    });
});