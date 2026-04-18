export const buildStyleObject =
  (valueMapper: (value: string) => string = (value) => value) =>
  (obj: Record<string, string>, style: string): Record<string, string> => {
    if (style.trim() === "") return obj;

    const index = style.indexOf(":");

    const key = style.substring(0, index);
    const value = style.substring(index + 1);

    return {
      ...obj,
      [key.trim()]: valueMapper(value).trim(),
    };
  };
