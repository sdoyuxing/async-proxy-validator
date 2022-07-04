import { typeOf } from "../utils";
function isNumOrDate(val: any) {
  return typeOf(val) === "number" || typeOf(val) === "date";
}

const value = (
  val: any,
  valOptin: { max?: number | Date; min?: number | Date }
) => {
  if (isNumOrDate(val)) {
    val = typeOf(val) === "date" ? val.getTime() : val;
    const max =
      isNumOrDate(valOptin.max) && typeOf(valOptin.max) === "date"
        ? (<Date>valOptin.max).getTime()
        : valOptin.max;
    const min =
      isNumOrDate(valOptin.min) && typeOf(valOptin.min) === "date"
        ? (<Date>valOptin.min).getTime()
        : valOptin.min;
    if (max && !min && val >= max) {
      return "max";
    } else if (min && !max && val <= min) {
      return "min";
    } else if (min && max && (max <= val || val <= min)) {
      return "between";
    }
  }
  return "";
};

export default value
