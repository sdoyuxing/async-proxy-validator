import { typeOf } from "../utils";

const len = (
  value: any,
  lenOption: { len?: number; max?: number; min?: number }
) => {
  if (typeOf(value) === "string" || typeOf(value) === "array") {
    if (lenOption.len && value.length !== lenOption.len) {
      return "len";
    } else if (
      lenOption.max &&
      !lenOption.min &&
      lenOption.max < value.length
    ) {
      return "maxlen";
    } else if (
      lenOption.min &&
      !lenOption.max &&
      lenOption.min > value.length
    ) {
      return "minlen";
    } else if (
      lenOption.min &&
      lenOption.max &&
      (lenOption.max < value.length || lenOption.min > value.length)
    ) {
      return "range";
    }
  }
  return "";
};
export default len;
