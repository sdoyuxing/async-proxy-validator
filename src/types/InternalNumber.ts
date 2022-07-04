import { Obj, Rule } from "../interface";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import MainType from "./mainType";
import message from "./message";

export default class InternalNumber extends MainType {
  protected _message: Obj = {
    type: "%s is not a number",
    between: "%s must be between %s and %s",
    max: "%s must be less than %s",
    min: "%s must be greater than %s",
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
        this.validateTypes() && this.validateValue();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
    }
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "number")) {
      this.error.push(
        this._rule.message || messageFormat(this._message.type, this._field)
      );
      return false;
    }
    return true;
  }
  validateValue() {
    const { len, max, min } = this._rule;
    if (len || max || min) {
      const messageType = rule.val(this._value, { max, min });
      if (messageType) {
        this.error.push(
          this._rule.message ||
            messageFormat(
              this._message[messageType],
              this._field,
              ...[max, min].filter((item) => item)
            )
        );
      }
    }
  }
}
