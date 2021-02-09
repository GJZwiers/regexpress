import { applyMixins } from '../utils/mixin';
import { RegexNestBuilder } from "./regex_nest_builder";
import { RegexAssertionBuilder } from "./regex_assertion_builder";
import { RegexCharacterClassBuilder } from "./regex_character_class_builder";
import { RegexQuantifierBuilder } from "./regex_quantifier_builder";
import { RegexBuilderBase } from "./regex_builder_base";
import { RegexAlternationBuilder } from "./regex_alternation_builder";
import { RegexGroupBuilder } from "./regex_group_builder";
import { RegexPartBuilder } from "./regex_part_builder";
import { RegexRangeBuilder } from "./regex_range_builder";
import { RegexFlagsBuilder } from "./regex_flags_builder";
import { RegexBackReferenceBuilder } from "./regex_backreference_builder";
import { Regex } from "./regex";

export class RegexBuilder {
    regex: Regex = new Regex();
    nests = 0;
}

export interface RegexBuilder extends 
    RegexBuilderBase,
    RegexFlagsBuilder,
    RegexPartBuilder,
    RegexGroupBuilder,
    RegexAssertionBuilder,
    RegexAlternationBuilder,
    RegexRangeBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    RegexCharacterClassBuilder,
    RegexNestBuilder {}

applyMixins(RegexBuilder, [
    RegexBuilderBase, 
    RegexFlagsBuilder, 
    RegexPartBuilder,
    RegexGroupBuilder,
    RegexAssertionBuilder,
    RegexAlternationBuilder,
    RegexRangeBuilder,
    RegexQuantifierBuilder,
    RegexBackReferenceBuilder,
    RegexCharacterClassBuilder,
    RegexNestBuilder]);
