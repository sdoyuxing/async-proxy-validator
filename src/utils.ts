import { initType } from "./interface";

export function initValue(type: string): initType {
  const initTypeMap: Record<string, initType> = {
    string: "",
    number: 0,
    object: null,
  };
  return initTypeMap[type];
}

export function typeOf(obj: any): string {
  const toString = Object.prototype.toString;
  const map: Record<string, string> = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  const key = toString.call(obj);
  if (key === "[object Number]" && isNaN(obj)) return "NaN";
  return map[key];
}
export function deepCopy<T>(data: T): T {
  const t = typeOf(data);
  let o;

  if (t === "array") {
    o = [];
  } else if (t === "object") {
    o = {};
  } else {
    return data;
  }

  if (t === "array") {
    for (let i = 0; i < (data as unknown as any[]).length; i++) {
      (<any[]>o).push(deepCopy((<any[]>(<unknown>data))[i]));
    }
  } else if (t === "object") {
    for (let i in data) {
      (<Record<string, any>>o)[i] = deepCopy(data[i]);
    }
  }
  return <T>o;
}
export function messageFormat(template: string, ...args: any[]) {
  let i = 0;
  return template.replace(/%s/g, () => {
    return args[i++];
  });
}
export function isEmptyValue(val:any) {
  return val === undefined || val === null;
}
