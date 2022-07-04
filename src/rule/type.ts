import { internalType } from "../interface";
import { typeOf } from "../utils";

const type = (value: any, type: internalType): boolean => {
  const urlPattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  const emailPattern =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  const types = {
    number(val: any) {
      if (isNaN(val)) return false;
      return typeOf(val) === "number";
    },
    boolean(val: any) {
      return typeOf(val) === "boolean";
    },
    array(val: any) {
      return Array.isArray(val);
    },
    string(val: any) {
      return typeOf(val) === "string";
    },
    date(val: any) {
      return typeOf(val) === "date" && !isNaN(val.getTime());
    },
    url(val: any) {
      return typeOf(val) === "string" && urlPattern.test(val);
    },
    email(val: any) {
      return typeOf(val) === "string" && emailPattern.test(val);
    },
  };
  return types[type](value);
};

export default type;
