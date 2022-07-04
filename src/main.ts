import { Obj, Rule, Rules, ValidateOptions } from "./interface";
import { deepCopy, typeOf } from "./utils";
import Validator from "./validator";
class ProxyValidator {
  source: Obj = {};
  private _rules: Rules = {};
  private _validator: Validator;
  constructor(rules: Rules, refValue?: any, options?: ValidateOptions) {
    this.rules = rules;
    this._validator = new Validator(this._rules, refValue);
    this.source = this._validator.proxy;
  }
  get rules() {
    return this._rules;
  }
  set rules(value) {
    if (typeOf(value) === undefined || typeOf(value) === null)
      throw new Error("ProxyValidator configuration parameter cannot be empty");
    if (typeOf(value) !== "object" || typeOf(value) === "array")
      throw new Error(
        "ProxyValidator configuration parameter must be an object"
      );

    this._rules = deepCopy(value);
    for (let key in this._rules) {
      if (!Array.isArray(this._rules[key]))
        this._rules[key] = [<Rule>this._rules[key]];
    }
  }
  validate(fn: any) {
    return this._validator.queue.nextTick(fn);
  }
}

export default ProxyValidator;
