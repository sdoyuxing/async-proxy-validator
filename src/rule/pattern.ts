import { typeOf } from "../utils";

const pattern = (val: any, pattern: string | RegExp) => {
  let _pattern: RegExp | undefined;
  if (pattern instanceof RegExp) {
    _pattern = pattern;
  }
  if (typeOf(pattern) === "string") {
    _pattern = new RegExp(pattern);
  }
  return _pattern?.test(val);
};

export default pattern;
