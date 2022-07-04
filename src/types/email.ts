import { Obj, ValidateType } from "../interface";
import rule from "../rule";
import { isEmptyValue, messageFormat } from "../utils";
import message from "./message";

export default class InternalEmail implements ValidateType {
  static message: Obj = {
    type: "%s is not a string",
    ...message,
  };
  error: string[] = [];
  private _rule: any;
  private _value: any;
  private _field: string = "";
  validate(): boolean {
    this.validateRequired();
    if (!isEmptyValue(this._value)) this.validateTypes();
    if (this._rule.validator) this._rule.validator(this._value);
    return this.error.length === 0;
  }
  validateTypes() {
    if (!rule.type(this._value, "email")) {
      this.error.push(messageFormat(InternalEmail.message.type, this._field));
    }
  }
  validateRequired() {
    if (this._rule.required && !rule.required(this._value)) {
      this.error.push(
        messageFormat(InternalEmail.message.required, this._field)
      );
    }
  }
}
