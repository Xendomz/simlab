export const generateQueryStringFromObject = (params: Record<string, string | number | boolean | undefined | null>) => {
    const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {} as Record<string, string>)
    ).toString()

    return queryString
}