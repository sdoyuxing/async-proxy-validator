import { Obj, Rule } from "../interface";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import MainType from "./mainType";
import message from "./message";

export default class InternalUrl extends MainType {
  protected _message: Obj = {
    type: "%s is not a url",
    ...message,
  };
  constructor(rule: Rule[], value: any, field: string, target: Obj) {
    super(rule, value, field, target);
  }
  validate(): boolean {
    for (let rule of this._rules) {
      if (this.error.length > 0) break;
      this._rule = rule;
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes() && this.validateLen();
      if (this._rule.pattern) this.validatePattern();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value, this._target));
    }
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "url")) {
      this.error.push(
        this._rule.message || messageFormat(this._message.type, this._field)
      );
      return false;
    }
    return true;
  }
}
