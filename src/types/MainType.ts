import { Obj, Rule, ValidateType } from "../interface";
import rule from "../rule";
import { messageFormat } from "../utils";

export default class MainType implements ValidateType {
  protected _message: Obj = {};
  error: string[] = [];
  protected _rules: Rule[] = [];
  protected _rule:Rule={}
  protected _value: any;
  protected _field: string = "";
  constructor(rule: Rule[], value: any, field: string) {
    Object.assign(this, { _rules: rule, _value: value, _field: field });
  }
  validate() {
    return true;
  }
  validateTypes() {}
  validateRequired() {
    if (this._rule.required && !rule.required(this._value)) {
      this.error.push(
        this._rule.message || messageFormat(this._message.required, this._field)
      );
      return false
    }
    return true
  }
  validateLen() {
    const { len, max, min } = this._rule;
    if (len || max || min) {
      const messageType = rule.len(this._value, {
        len,
        max: <number>max,
        min: <number>min,
      });
      if (messageType) {
        this.error.push(
          messageFormat(
            this._rule.message || this._message[messageType],
            this._field,
            ...[len, max, min].filter((item) => item)
          )
        );
      }
    }
  }
  validateValue() {}
}
