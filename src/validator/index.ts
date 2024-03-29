import { internalType, Obj, Rule, Rules } from "../interface";
import { initValue, typeOf } from "../utils";
import TypesValidator from "../types";
import { JobQueue } from "./queue";
const proxyMap = new WeakMap<Rules, any>();
class Validator {
  proxy: Obj;
  queue: JobQueue;
  private _rules: Rules = {};
  error: Obj = {};
  constructor(rules: Rules, refValue?: any, refError?: any) {
    this.queue = new JobQueue();
    this._rules = rules;
    const existingProxy = proxyMap.get(rules);
    if (existingProxy) {
      this.proxy = existingProxy;
    } else {
      const source = refValue || this.initSource(rules);
      this.error = refError || this.error;
      this.proxy = new Proxy<Obj>(source, {
        set: this.set.bind(this),
      });
      proxyMap.set(rules, this.proxy);
    }
  }
  initSource(rules: Rules): Obj {
    return Object.keys(rules).reduce((source: Obj, key: string): Obj => {
      let typeObj = (<Rule[]>rules[key]).find((rule) => rule.type);
      source[key] = initValue(typeObj?.type || "string");
      return source;
    }, {});
  }
  set(target: Obj, key: string, value: any, proxy?: any): boolean {
    if (key !== "error" && target.hasOwnProperty(key)) {
      let type =
        (<Rule[]>this._rules[key]).find((rule) => rule.type)?.type ?? "string";
      let transform = (<Rule[]>this._rules[key]).find(
        (rule) => rule.transform
      )?.transform;
      if (transform) {
        value = transform(value);
      }
      type ||= "string";
      const validate = () => {
        const validator = new TypesValidator[<internalType>type](
          <Rule[]>this._rules[key],
          value,
          key,
          target
        );
        if (!validator.validate()) {
          this.error[key] = validator.error.join();
          return this.error;
        } else {
          this.error[key] = "";
        }
      };
      const job = { field: key, validate };
      this.queue.queueJob(job);
      this.queue.loopTick();

      if (type === "string" && typeOf(value) === "string")
        value = String.prototype.trim.call(value);
      return proxy ? Reflect.set(target, key, value, proxy) : true;
    } else {
      throw Error(`${key} is not a valid property`);
    }
  }
}

export default Validator;
