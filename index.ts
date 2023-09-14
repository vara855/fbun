import isPlainObject from "lodash/isPlainObject";

const flatObject = (
  obj: Record<string, any> = {},
  concatenate = ".",
  maxArrayElements?: number
): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    if (isPlainObject(obj[key])) {
      const flattenedChild = flatObject(
        obj[key],
        concatenate,
        maxArrayElements
      );
      Object.keys(flattenedChild).forEach((childKey) => {
        acc[`${key}${concatenate}${childKey}`] = flattenedChild[childKey];
      });

      return acc;
    }

    if (obj[key] instanceof Array) {
      const array =
        maxArrayElements !== undefined
          ? obj[key].slice(0, maxArrayElements)
          : obj[key];
      if (array.every((item: any) => isPlainObject(item))) {
        array.forEach((item: any) => {
          const flattenItem = flatObject(item, concatenate, maxArrayElements);
          Object.keys(flattenItem).forEach((childKey) => {
            const prevValue = acc[`${key}${concatenate}${childKey}`] || [];
            acc[`${key}${concatenate}${childKey}`] = [
              ...prevValue,
              flattenItem[childKey],
            ].flat();
          });
        });
        return acc;
      }
    }

    if (obj[key] instanceof Array) {
      const array =
        maxArrayElements !== undefined
          ? obj[key].slice(0, maxArrayElements)
          : obj[key];
      acc[key] = array.join(", ");
      return acc;
    }
    acc[key] = obj[key];
    return acc;
  }, {} as Record<PropertyKey, any>);
};

(async () => {
  const stub = Bun.file("./stub.json");
  const stubJson = await stub.json();
  console.time("bun");
  flatObject(stubJson);
  console.timeEnd("bun");
})();
