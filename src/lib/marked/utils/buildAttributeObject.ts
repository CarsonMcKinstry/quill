export const buildAttributeObject =
  (valueMapper: (value: string) => string = (value) => value) =>
  (obj: Record<string, string>, attr: string): Record<string, string> => {
    if (attr.trim() === "") return obj;

    const index = attr.indexOf("=");

    const key = attr.substring(0, index);
    const value = attr.substring(index + 1);

    return {
      ...obj,
      [key.trim()]: valueMapper(value).trim(),
    };
  };
