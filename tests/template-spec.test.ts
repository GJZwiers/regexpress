import { expect } from 'chai';
import { DefaultSpecification } from "../src/template-spec/TemplateSpecification";

describe("DefaultSpecification", () => {
    it("should build a template from data correctly", () => {
        let mockData = { foo: 'bar' };
        let mockSettings = { template: 'foo' };
        let spec = new DefaultSpecification(mockData, mockSettings);
        expect(spec.buildTemplate(mockSettings.template)).to.equal('bar');
    });
    it("should join arrays correctly", () => {
        let mockData = { foo: ['bar', 'baz'] };
        let mockSettings = { template: 'foo' };
        expect(new DefaultSpecification(mockData, mockSettings)
            .buildTemplate(mockSettings.template)).to.equal('bar|baz');
    });
    it("should substitute placeholders correctly", () => {
        let mockData = { foo: ['{{bar}}', 'baz'] };
        let mockSettings = { template: 'foo' };
        let mockPlaceholders = { bar: [ 'bar']}
        expect(new DefaultSpecification(mockData, mockSettings, mockPlaceholders)
            .buildTemplate(mockSettings.template)).to.equal('bar|baz');
    });
    it("should handle a custom separator correctly", () => {
        let mockData = { foo: ['bar', 'baz'] };
        let mockSettings = { template: 'foo', separator: '[: ]+' };
        expect(new DefaultSpecification(mockData, mockSettings)
            .buildTemplate(mockSettings.template)).to.equal('bar[: ]+baz');
    });
});
