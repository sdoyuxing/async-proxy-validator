import { Obj, Rule, Rules, ValidateOptions } from "./interface";
import { deepCopy, typeOf } from "./utils";
import Validator from "./validator";

function validateRules(rules: Rules): Rules {
  if (typeOf(rules) === undefined || typeOf(rules) === null)
    throw new Error("ProxyValidator configuration parameter cannot be empty");
  if (typeOf(rules) !== "object" || typeOf(rules) === "array")
    throw new Error("ProxyValidator configuration parameter must be an object");

  const internalRules = deepCopy(rules);
  for (let key in internalRules) {
    if (!Array.isArray(internalRules[key]))
      internalRules[key] = [<Rule>internalRules[key]];
  }
  return internalRules;
}

function asyncProxyValidator(
  rules: Rules,
  refValue?: any,
  refError?: any,
  options?: ValidateOptions
) {
  const source: Obj = {};
  const internalRules: Rules = validateRules(rules);
  const internalValidator = new Validator(internalRules, refValue, refError);
  return {
    source: internalValidator.proxy,
    error: internalValidator.error,
    validate(fn: any) {
      for (let key in internalRules) {
        if (
          internalRules.hasOwnProperty(key) &&
          !internalValidator.queue.queueFind(key)
        ) {
          internalValidator.set(
            internalValidator.proxy,
            key,
            internalValidator.proxy[key]
          );
        }
      }
      return internalValidator.queue.nextTick(fn);
    },
  };
}

export { asyncProxyValidator };
