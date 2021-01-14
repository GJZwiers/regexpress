import { RegexSettings, RegexData, RegexPlaceholders } from "./interfaces";
import { ExtendedRegExp } from "./augmentedExp";
import { PatternCrafter } from "./renoCompiler";

class RegexNotationObject {
    public settings: RegexSettings = {template: '', flags: ''}
    public data: RegexData = {}
    public placeholders: RegexPlaceholders = {}

    static new(): RenoBuilder {
        return new RenoBuilder();
    }
}

abstract class RegexBuilder {
    protected reno: RegexNotationObject = new RegexNotationObject();

    build(): ExtendedRegExp[] {
        return new PatternCrafter().craft(this.reno);;
    }
}

class RegexSettingsBuilder<T extends RegexSettingsBuilder<T>>
    extends RegexBuilder {

    settings(settings: RegexSettings): T {
        this.reno.settings = settings;
        return <T><unknown>this;
    }
}

class RegexDataBuilder<T extends RegexDataBuilder<T>>
    extends RegexSettingsBuilder<RegexDataBuilder<T>> {
    
    data(data: RegexData): T {
        this.reno.data = data;
        return <T><unknown>this;
    }
}

class RegexPlaceholderBuilder<T extends RegexPlaceholderBuilder<T>>
    extends RegexDataBuilder<RegexPlaceholderBuilder<T>> {

    placeholders(ph: RegexPlaceholders): T {
        this.reno.placeholders = ph;
        return <T><unknown>this;
    }
}

class RenoBuilder extends RegexPlaceholderBuilder<RenoBuilder> { }

function main() {
    let reno = RegexNotationObject.new()
        .settings({
            template: '(greetings) (?=environments)',
            flags: 'i'
        })
        .data({
            greetings: [ 'Hello', 'Good Morning', 'Ciao' ],
            environments: [ 'World', 'New York', '~~foo~~' ]
        })
        .placeholders({ foo: ['Italy'] })
        .build();

    console.log(reno);
}

export { RegexNotationObject, RenoBuilder }