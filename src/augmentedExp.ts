export class AugmentedExp extends RegExp {
    private _template: string

    constructor(pattern: string, flags: string, template: string) {
        super(pattern, flags);
        this._template = template;
    }
}
