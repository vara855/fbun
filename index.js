import isPlainObject from "lodash/isPlainObject.js";
import fs from "fs/promises";
const flatObject = (obj = {}, concatenate = ".", maxArrayElements) => {
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
      if (array.every((item) => isPlainObject(item))) {
        array.forEach((item) => {
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
  }, {});
};
(async () => {
  console.time("node");
  const file = await fs.readFile("./stub.json");
  //   const stub = Bun.file("./stub.json");
  const stubJson = JSON.parse(file);
  flatObject(stubJson);
  console.timeEnd("node");
})();
