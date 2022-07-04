import { Obj, ValidateType } from "../interface";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import message from "./message";

export default class InternalDate implements ValidateType {
  error: string[] = [];
  static message: Obj = {
    type: "%s is not a date",
    ...message,
  };
  private _rule: any;
  private _value: any;
  private _field: string = "";
  constructor(rule: any, value: any, field: string) {
    Object.assign(this, { _rule: rule, _value: value, _field: field });
  }
  validate(): boolean {
    this.validateRequired();
    if (!isEmptyValue(this._value)) this.validateTypes();
    if (this._rule.validator) this._rule.validator(this._value);
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "date")) {
      this.error.push(messageFormat(InternalDate.message.type, this._field));
    }
  }
  validateRequired() {
    if (this._rule.required && !rule.required(this._value)) {
      this.error.push(
        messageFormat(InternalDate.message.required, this._field)
      );
    }
  }
}
