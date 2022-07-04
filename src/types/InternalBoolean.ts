import { Obj, Rule } from "../interface";
import message from "./message";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import MainType from "./mainType";

export default class InternalBoolean extends MainType {
  protected _message: Obj = {
    type: "%s is not a boolean",
    ...message,
  };
  constructor(rule: Rule[], value: any, field: string) {
    super(rule, value, field);
  }
  validate(): boolean {
    for (let rule of this._rules) {
      if (this.error.length > 0) break;
      this._rule = rule;
      if (this.validateRequired()) {
        if (!isEmptyValue(this._value)) this.validateTypes();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value));
      }
    }
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "boolean")) {
      this.error.push(
        this._rule.message || messageFormat(this._message.type, this._field)
      );
    }
  }
}
