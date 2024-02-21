declare namespace mw {
    type QueryParams = Record<string, string | number | boolean | null | undefined>;

    type TypeOrArray<T> = T | T[];

    type TypeOrUnionArray<T> = T extends any ? TypeOrArray<T> : never;

    type ReplaceValue<T extends U | U[], U, V> = T extends U[] ? V[] : V;

    // Get/PickOrDefault<V, S, TD, TX> extracts values from V using key selection S
    //  - TD is the value type of missing properties
    //  - TX is the value type of unknown properties

    type GetOrDefault<V, K extends PropertyKey, TD, TX = unknown> = K extends keyof V
        ? V extends Required<Pick<V, K>>
            ? V[K]
            : Required<V>[K] | TD
        : TX | TD;

    type PickOrDefault<V, S extends TypeOrArray<PropertyKey>, TD, TX = unknown> = S extends Array<
        infer K
    >
        ? { [P in K & PropertyKey]-?: GetOrDefault<V, P, TD, TX> }
        : GetOrDefault<V, S & PropertyKey, TD, TX>;

    type NoReturn<T extends (...args: any[]) => any> = T extends (
        this: infer U,
        ...args: infer V
    ) => any
        ? unknown extends U
            ? (...args: V) => void
            : (this: U, ...args: V) => void
        : never;
}
