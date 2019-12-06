export class ObjectCloner {
    static deepCopy<T extends object>(obj: T) : T {
        return JSON.parse(JSON.stringify(obj));
    }
}
