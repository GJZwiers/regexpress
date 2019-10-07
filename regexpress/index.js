"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Regexpress {
    constructor(placeholderSubstitutes) {
        this._placeholderSubstitutes = placeholderSubstitutes;
        this._regexData = { settings: { template: "empty", flags: "" }, "empty": ['empty'] };
    }
    setPlaceholderSubstitutes(subs) {
        this._placeholderSubstitutes = subs;
    }
    buildRegex(regexData) {
        this._regexData = regexData;
        this._buildValues();
        return new RegExp(this._buildTemplate(), this._regexData.settings.flags);
    }
    _buildValues() {
        for (let key in this._regexData) {
            if (!Array.isArray(this._regexData[key]))
                continue;
            this._regexData[key] = this._joinArrayWithPipeSymbols(this._regexData[key]);
        }
    }
    _joinArrayWithPipeSymbols(arr) {
        return arr.join('|');
    }
    _buildTemplate() {
        if (!this._placeholderSubstitutes)
            return this._substituteTemplateVariables(this._regexData.settings.template);
        return this._substitutePlaceholders(this._substituteTemplateVariables(this._regexData.settings.template));
    }
    _substituteTemplateVariables(template) {
        const template_vars = template.match(/\w+/g);
        if (template_vars === null)
            throw new Error('Regexpress: cannot build regex with 0 template groups');
        for (let template_var of template_vars) {
            if (!this._regexData[template_var]) {
                continue;
            }
            template = template.replace(template_var, this._regexData[template_var]);
        }
        return template;
    }
    _substitutePlaceholders(regexString) {
        for (let name in this._placeholderSubstitutes) {
            let substitute = this._placeholderSubstitutes[name];
            regexString = regexString.replace(`~~${name}~~`, substitute.join('|'));
        }
        return regexString;
    }
    _mapCaptureGroups(template) {
        const groups = template.match(/\((\w+?)\)/g);
        let map = [];
        map[0] = 'full_match';
        if (groups === null)
            return map;
        for (let i = 0; i < groups.length; i++) {
            let key = groups[i][1];
            map[i + 1] = key;
        }
        return map;
    }
}
exports.Regexpress = Regexpress;
//# sourceMappingURL=index.js.map