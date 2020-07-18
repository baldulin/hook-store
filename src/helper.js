export const copy = (objOrArray) => (
    Array.isArray(objOrArray)
        ? objOrArray.slice()
        : {...objOrArray}
);

export const isObject = (obj) => (
    !Array.isArray(obj) && typeof obj === "object" && obj !== undefined && obj !== null
);
