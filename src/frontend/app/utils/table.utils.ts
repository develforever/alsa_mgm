export function buildArray<T, Extra extends string = never>(
    baseColumns: (keyof T)[],
    extraColumns?: Extra[]
): (keyof T | Extra)[] {
    return [...baseColumns, ...(extraColumns || [])];
}

