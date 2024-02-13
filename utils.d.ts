declare namespace mw {
    type QueryParams = Record<string, string | number | boolean | null | undefined>;

    type TypeOrArray<T> = T | T[];

    type TypeOrUnionArray<T> = T extends any ? TypeOrArray<T> : never;

    type ReplaceValue<T extends U | U[], U, V> = T extends U[] ? V[] : V;

    type GetOrDefault<V, K extends keyof V, T> = V extends Required<Pick<V, K>>
        ? V[K]
        : Required<V>[K] | T;

    type PickOrDefault<V, S extends keyof V | Array<keyof V>, T> = S extends Array<infer SS>
        ? { [K in SS & keyof V]-?: GetOrDefault<V, K, T> }
        : GetOrDefault<V, S & keyof V, null>;

    type NoReturn<T extends (...args: any[]) => any> = T extends (
        this: infer U,
        ...args: infer V
    ) => any
        ? unknown extends U
            ? (...args: V) => void
            : (this: U, ...args: V) => void
        : never;

    type FlipObject<T extends Record<PropertyKey, PropertyKey>> = { [K in keyof T as T[K]]: K };
}
