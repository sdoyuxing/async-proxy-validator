import { Obj, Rule } from "../interface";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import MainType from "./mainType";
import message from "./message";

export default class InternalEmail extends MainType {
  protected _message: Obj = {
    type: "%s is not a email",
    ...message,
  };
  constructor(rule: Rule[], value: any, field: string) {
    super(rule, value, field);
  }
  validate(): boolean {
    for (let rule of this._rules) {
      if (this.error.length > 0) break;
      this._rule = rule;
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes() && this.validateLen();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
    }
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "email")) {
      this.error.push(
        this._rule.message || messageFormat(this._message.type, this._field)
      );
      return false;
    }
    return true;
  }
}
