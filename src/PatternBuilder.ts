class Pattern {
    public parts: Array<string> = []
    public flags: string = ''

    static new(): Builder {
        return new Builder();
    }
}

abstract class PatternBuilder {
    protected pattern: Pattern = new Pattern();

    build(): Pattern {
        return this.pattern;
    }
}

class PatternPartBuilder<SELF extends PatternPartBuilder<SELF>>
    extends PatternBuilder {

    part(part: string): SELF {
        this.pattern.parts.push(part);
        return <SELF><unknown>this;
    }
}

class PatternGroupBuilder<SELF extends PatternPartBuilder<SELF>>
    extends PatternPartBuilder<PatternGroupBuilder<SELF>> {
    
    capturing(cg: string): SELF {
        this.pattern.parts.push('(', cg, ')');
        return <SELF><unknown>this;
    }

    noncapturing(ncg: string): SELF {
        this.pattern.parts.push('(?:', ncg, ')');
        return <SELF><unknown>this;
    }

    lookahead(la: string): SELF {
        this.pattern.parts.push('(?=', la, ')');
        return <SELF><unknown>this;
    }

    lookbehind(lb: string): SELF {
        this.pattern.parts.push('(?<=', lb, ')');
        return <SELF><unknown>this;
    }

    group(type: 'cg' | 'ncg' | 'la' | 'nla' | 'lb' | 'nlb', group: string) {
        let grouptype;
        if (type === 'cg') {
            grouptype = '(';
        } else if (type === 'ncg') {
            grouptype = '(?:'
        } else if (type === 'la') {
            grouptype = '(?='
        } else if (type === 'lb') {
            grouptype = '(?<='
        } else if (type === 'nla') {
            grouptype = '(?!'
        } else if (type === 'nlb') {
            grouptype = '(?<!'
        }

        this.pattern.parts.push('(?', group, ')');
        return <SELF><unknown>this;
    }
}

class Builder extends PatternGroupBuilder<Builder> {

}

function main() {
    let regex = Pattern.new()
        .capturing('\\d{1,4}')
        .capturing('[cdm]l|L')
        .build();

        console.log(regex);
}