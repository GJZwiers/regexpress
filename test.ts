function GenericFunc<T>(arg: T) : T {
    return arg;
}

interface contractMethods {
    (name: string, id: number)
}


interface Lengthy {
    length: number;
}

function lengthFunc<T extends Lengthy> (arg: T) : T {
    console.log(arg.length);
    return arg;
}

interface Everything {
    thing: any;
}

class Something implements Everything {
    public thing = null;
}

interface Omnipotent {

}

class Overlord extends Something implements Omnipotent  {

}

