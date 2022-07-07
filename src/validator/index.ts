import { internalType, Obj, Rule, Rules } from "../interface";
import { initValue } from "../utils";
import typesValidator from "../types";
import { JobQueue } from "./queue";
const proxyMap = new WeakMap<Rules, any>();
class Validator {
  proxy: Obj;
  queue: JobQueue;
  private _rules: Rules = {};
  private _error: Obj = {};
  constructor(rules: Rules, refValue?: any) {
    this.queue = new JobQueue();
    this._rules = rules;
    const existingProxy = proxyMap.get(rules);
    if (existingProxy) {
      this.proxy = existingProxy;
    } else {
      this.proxy = new Proxy<Obj>(refValue || this.initSource(rules), {
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
  set(target: Obj, key: string, value: any, proxy: any): boolean {
    if (target.hasOwnProperty(key)) {
      let type =
        (<Rule[]>this._rules[key]).find((rule) => rule.type)?.type ?? "string";
      let transform = (<Rule[]>this._rules[key]).find(
        (rule) => rule.transform
      )?.transform;
      type ||= "string";
      const validate = () => {
        const validator = new typesValidator[<internalType>type](
          <Rule[]>this._rules[key],
          value,
          key
        );
        if (!validator.validate()) {
          this._error[key] ||= [];
          this._error[key].push(...validator.error);
          return this._error;
        }
      };
      const job = { field: key, validate };
      this.queue.queueJob(job);
      if (transform) {
        value = transform(value);
      }
      if(type==='string') (<string>value).trim()
      return Reflect.set(target, key, value, proxy);
    } else {
      throw Error(`${key} is not a valid property`);
    }
  }
}

export default Validator;
