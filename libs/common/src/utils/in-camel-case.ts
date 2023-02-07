const camelize = (s: string) => {
    return s.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

export function objKeysToCamelCase(value: unknown): unknown {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!value || value === {} || value === [] || typeof value === 'function' || value instanceof Date) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((valueItem) => objKeysToCamelCase(valueItem));
    }
    if (typeof value === 'object') {
        return Object.keys(value)
            .map((key) => ({ [camelize(key)]: objKeysToCamelCase((value as Record<string, unknown>)[key]) }))
            .reduce((pre = {}, curr) => ({ ...pre, ...curr }), {});
    }
    return value;
}

export function InCamelCase() {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
        const oldFunc = descriptor.value;
        descriptor.value = async function () {
            // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            const result = await oldFunc.apply(this, arguments);
            return objKeysToCamelCase(result);
        };
    };
}
