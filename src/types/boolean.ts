import { Obj, ValidateType } from "../interface";
import message from "./message";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";

export default class InternalBoolean implements ValidateType {
  static message: Obj = {
    type: "%s is not a boolean",
    ...message,
  };
  error: string[] = [];
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
    if (!rule.type(this._value, "boolean")) {
      this.error.push(messageFormat(InternalBoolean.message.type, this._field));
    }
  }
  validateRequired() {
    if (this._rule.required && !rule.required(this._value)) {
      this.error.push(
        messageFormat(InternalBoolean.message.required, this._field)
      );
    }
  }
}