export interface RXData {
    [key: string]: Array<string> | string
}
export interface RXPlaceholder {
    [key: string]: Array<string>
}
export interface RXBasic {
    flags: string
    separator?: string,
    autosort?: boolean
}
export interface RXSingle extends RXBasic {
    template: string;
}
export interface RXList extends RXBasic {
    templateList: Array<string>;
}
export type RXSettings = RXSingle | RXList;
