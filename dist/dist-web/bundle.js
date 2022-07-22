(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bundle = factory());
})(this, (function () { 'use strict';

  function initValue(type) {
    const initTypeMap = {
      string: "",
      number: 0,
      object: null
    };
    return initTypeMap[type];
  }
  function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object"
    };
    const key = toString.call(obj);
    if (key === "[object Number]" && isNaN(obj))
      return "NaN";
    return map[key];
  }
  function deepCopy(data) {
    const t = typeOf(data);
    let o;
    if (t === "array") {
      o = [];
    } else if (t === "object") {
      o = {};
    } else {
      return data;
    }
    if (t === "array") {
      for (let i = 0; i < data.length; i++) {
        o.push(deepCopy(data[i]));
      }
    } else if (t === "object") {
      for (let i in data) {
        o[i] = deepCopy(data[i]);
      }
    }
    return o;
  }
  function messageFormat(template, ...args) {
    let i = 0;
    return template.replace(/%s/g, () => {
      return args[i++];
    });
  }
  function isEmptyValue(val) {
    return val === void 0 || val === null;
  }

  const type = (value, type2) => {
    const urlPattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    const emailPattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    const types = {
      number(val) {
        if (isNaN(val))
          return false;
        return typeOf(val) === "number";
      },
      boolean(val) {
        return typeOf(val) === "boolean";
      },
      array(val) {
        return Array.isArray(val);
      },
      string(val) {
        return typeOf(val) === "string";
      },
      date(val) {
        return typeOf(val) === "date" && !isNaN(val.getTime());
      },
      url(val) {
        return typeOf(val) === "string" && urlPattern.test(val);
      },
      email(val) {
        return typeOf(val) === "string" && emailPattern.test(val);
      }
    };
    return types[type2](value);
  };

  const required = (value) => {
    if (value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const len = (value, lenOption) => {
    if (typeOf(value) === "string" || typeOf(value) === "array") {
      if (lenOption.len && value.length !== lenOption.len) {
        return "len";
      } else if (lenOption.max && !lenOption.min && lenOption.max < value.length) {
        return "maxlen";
      } else if (lenOption.min && !lenOption.max && lenOption.min > value.length) {
        return "minlen";
      } else if (lenOption.min && lenOption.max && (lenOption.max < value.length || lenOption.min > value.length)) {
        return "range";
      }
    }
    return "";
  };

  function isNumOrDate(val) {
    return typeOf(val) === "number" || typeOf(val) === "date";
  }
  const value = (val, valOptin) => {
    if (isNumOrDate(val)) {
      val = typeOf(val) === "date" ? val.getTime() : val;
      const max = isNumOrDate(valOptin.max) && typeOf(valOptin.max) === "date" ? valOptin.max.getTime() : valOptin.max;
      const min = isNumOrDate(valOptin.min) && typeOf(valOptin.min) === "date" ? valOptin.min.getTime() : valOptin.min;
      if (max && !min && val >= max) {
        return "max";
      } else if (min && !max && val <= min) {
        return "min";
      } else if (min && max && (max <= val || val <= min)) {
        return "between";
      }
    }
    return "";
  };

  const pattern = (val, pattern2) => {
    let _pattern;
    if (pattern2 instanceof RegExp) {
      _pattern = pattern2;
    }
    if (typeOf(pattern2) === "string") {
      _pattern = new RegExp(pattern2);
    }
    return _pattern == null ? void 0 : _pattern.test(val);
  };

  var rule = {
    type,
    required,
    len,
    val: value,
    pattern
  };

  class MainType {
    constructor(rule2, value, field, target) {
      this._message = {};
      this.error = [];
      this._rules = [];
      this._rule = {};
      this._field = "";
      this._target = {};
      Object.assign(this, {
        _rules: rule2,
        _value: value,
        _field: field,
        _target: target
      });
    }
    validate() {
      return true;
    }
    validateTypes() {
    }
    validateRequired() {
      if (this._rule.required && !rule.required(this._value)) {
        this.error.push(this._rule.message || messageFormat(this._message.required, this._field));
        return false;
      }
      return true;
    }
    validateLen() {
      const { len, max, min } = this._rule;
      if (len || max || min) {
        const messageType = rule.len(this._value, {
          len,
          max,
          min
        });
        if (messageType) {
          this.error.push(messageFormat(this._rule.message || this._message[messageType], this._field, ...[len, max, min].filter((item) => item)));
        }
      }
    }
    validateValue() {
    }
    validatePattern() {
      if (!rule.pattern(this._value, this._rule.pattern)) {
        this.error.push(this._rule.message || messageFormat(this._message.pattern, this._field));
      }
    }
  }

  var message = {
    required: "%s is required",
    len: "%s length must be %s"
  };

  var __defProp$6 = Object.defineProperty;
  var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
  var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
  var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$6 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$6.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    if (__getOwnPropSymbols$6)
      for (var prop of __getOwnPropSymbols$6(b)) {
        if (__propIsEnum$6.call(b, prop))
          __defNormalProp$6(a, prop, b[prop]);
      }
    return a;
  };
  class InternalNumber extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$6({
        type: "%s is not a number",
        between: "%s must be between %s and %s",
        max: "%s must be less than %s",
        min: "%s must be greater than %s"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        this.validateRequired();
        if (!isEmptyValue(this._value))
          this.validateTypes() && this.validateValue();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value, this._target));
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "number")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
    validateValue() {
      const { len, max, min } = this._rule;
      if (len || max || min) {
        const messageType = rule.val(this._value, { max, min });
        if (messageType) {
          this.error.push(this._rule.message || messageFormat(this._message[messageType], this._field, ...[max, min].filter((item) => item)));
        }
      }
    }
  }

  var __defProp$5 = Object.defineProperty;
  var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
  var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
  var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$5 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$5.call(b, prop))
        __defNormalProp$5(a, prop, b[prop]);
    if (__getOwnPropSymbols$5)
      for (var prop of __getOwnPropSymbols$5(b)) {
        if (__propIsEnum$5.call(b, prop))
          __defNormalProp$5(a, prop, b[prop]);
      }
    return a;
  };
  class InternalBoolean extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$5({
        type: "%s is not a boolean"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        if (this.validateRequired()) {
          if (!isEmptyValue(this._value))
            this.validateTypes();
          if (this._rule.validator)
            this.error.push(this._rule.validator(this._value, this._target));
        }
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "boolean")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
      }
    }
  }

  var __defProp$4 = Object.defineProperty;
  var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
  var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
  var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$4 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    if (__getOwnPropSymbols$4)
      for (var prop of __getOwnPropSymbols$4(b)) {
        if (__propIsEnum$4.call(b, prop))
          __defNormalProp$4(a, prop, b[prop]);
      }
    return a;
  };
  class InternalArray extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$4({
        type: "%s is not a array",
        between: "%s length must be between %s and %s",
        max: "%s length must be less than %s",
        min: "%s length must be greater than %s"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        if (this.validateRequired()) {
          if (!isEmptyValue(this._value))
            this.validateTypes() && this.validateLen();
          if (this._rule.validator)
            this.error.push(this._rule.validator(this._value, this._target));
        }
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "array")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
  }

  var __defProp$3 = Object.defineProperty;
  var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
  var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
  var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$3 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    if (__getOwnPropSymbols$3)
      for (var prop of __getOwnPropSymbols$3(b)) {
        if (__propIsEnum$3.call(b, prop))
          __defNormalProp$3(a, prop, b[prop]);
      }
    return a;
  };
  class InternalString extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$3({
        type: "%s is not a string",
        between: "%s length must be between %s and %s",
        max: "%s length must be less than %s",
        min: "%s length must be greater than %s",
        pattern: "%s does not match pattern"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        this.validateRequired();
        if (!isEmptyValue(this._value))
          this.validateTypes() && this.validateLen();
        if (this._rule.pattern)
          this.validatePattern();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value, this._target));
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "string")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
  }

  var __defProp$2 = Object.defineProperty;
  var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
  var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
  var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$2 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    if (__getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(b)) {
        if (__propIsEnum$2.call(b, prop))
          __defNormalProp$2(a, prop, b[prop]);
      }
    return a;
  };
  class InternalDate extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$2({
        type: "%s is not a date",
        between: "%s must be between %s and %s",
        max: "%s must be less than %s",
        min: "%s must be greater than %s"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        this.validateRequired();
        if (!isEmptyValue(this._value))
          this.validateTypes() && this.validateValue();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value, this._target));
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "date")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
    validateValue() {
      const { max, min } = this._rule;
      if (max || min) {
        const messageType = rule.val(this._value, { max, min });
        if (messageType) {
          this.error.push(messageFormat(this._rule.message || this._message[messageType], this._field, ...[max, min].filter((item) => item).map((item) => new Date(item).toString())));
        }
      }
    }
  }

  var __defProp$1 = Object.defineProperty;
  var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
  var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
  var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$1 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    if (__getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(b)) {
        if (__propIsEnum$1.call(b, prop))
          __defNormalProp$1(a, prop, b[prop]);
      }
    return a;
  };
  class InternalEmail extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues$1({
        type: "%s is not a email"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        this.validateRequired();
        if (!isEmptyValue(this._value))
          this.validateTypes() && this.validateLen();
        if (this._rule.pattern)
          this.validatePattern();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value, this._target));
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "email")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
  }

  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  class InternalUrl extends MainType {
    constructor(rule2, value, field, target) {
      super(rule2, value, field, target);
      this._message = __spreadValues({
        type: "%s is not a url"
      }, message);
    }
    validate() {
      for (let rule2 of this._rules) {
        if (this.error.length > 0)
          break;
        this._rule = rule2;
        this.validateRequired();
        if (!isEmptyValue(this._value))
          this.validateTypes() && this.validateLen();
        if (this._rule.pattern)
          this.validatePattern();
        if (this._rule.validator)
          this.error.push(this._rule.validator(this._value, this._target));
      }
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "url")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
        return false;
      }
      return true;
    }
  }

  var TypesValidator = {
    number: InternalNumber,
    boolean: InternalBoolean,
    array: InternalArray,
    string: InternalString,
    date: InternalDate,
    email: InternalEmail,
    url: InternalUrl
  };

  class Queue {
    constructor(field) {
      this.map = /* @__PURE__ */ new Map();
      this.head = 0;
      this.tail = 0;
      this.indexMap = /* @__PURE__ */ new Map();
      this.field = field;
    }
    clear() {
      this.map.clear();
    }
    enqueue(value) {
      if (!Array.isArray(value))
        value = [value];
      value.forEach((item) => {
        if (this.field && typeof value === "object" && value.hasOwnProperty(this.field))
          this.indexMap.set(value[this.field], this.tail);
        this.map.set(this.tail++, item);
      });
    }
    dequeue() {
      const item = this.map.get(this.head);
      this.map.delete(this.head++);
      return item;
    }
    find(field) {
      if (typeof field === "number")
        return this.map.get(field);
      if (typeof field === "string" && this.field)
        return this.map.get(this.indexMap.get(field));
    }
    get length() {
      return this.map.size;
    }
    *[Symbol.iterator]() {
      let current = this.map.get(this.head);
      while (current) {
        yield current;
        current = this.map.get(++this.head);
      }
    }
  }
  class JobQueue {
    constructor() {
      this.currentFlushPromise = Promise.resolve();
      this.queue = new Queue();
    }
    queueJob(job) {
      const internalJob = this.queue.find(job.field);
      if (internalJob) {
        internalJob.validate = job.validate;
      } else {
        this.queue.enqueue(job);
      }
    }
    queueFlush() {
      const implementQueue = new Queue();
      implementQueue.enqueue([...this.queue]);
      this.queue.clear();
      this.currentFlushPromise = Promise.resolve().then(() => {
        try {
          this.flushJobs(implementQueue);
        } catch (error) {
          throw error;
        }
      });
    }
    flushJobs(implementQueue) {
      if (implementQueue.length > 0) {
        let result = {};
        let error;
        try {
          for (let queueItem of implementQueue) {
            result = queueItem.validate();
          }
        } catch (error2) {
          console.error(error2);
          throw error2;
        }
        error = deepCopy(result);
        for (let key in result) {
          result[key].length = 0;
        }
        if (error)
          throw error;
      }
    }
    nextTick(fn) {
      this.queueFlush();
      const p = this.currentFlushPromise;
      if (fn) {
        return p.then(this ? fn.bind(this) : fn, fn);
      }
      return p;
    }
    loopTick() {
      this.currentFlushPromise.then(() => {
        if (this.queue.length) {
          this.nextTick();
        }
      }, () => {
      });
    }
  }

  const proxyMap = /* @__PURE__ */ new WeakMap();
  class Validator {
    constructor(rules, refValue) {
      this._rules = {};
      this._error = {};
      this.queue = new JobQueue();
      this._rules = rules;
      const existingProxy = proxyMap.get(rules);
      if (existingProxy) {
        this.proxy = existingProxy;
      } else {
        const source = refValue || this.initSource(rules);
        source.error = {};
        this.proxy = new Proxy(source, {
          set: this.set.bind(this)
        });
        proxyMap.set(rules, this.proxy);
      }
    }
    initSource(rules) {
      return Object.keys(rules).reduce((source, key) => {
        let typeObj = rules[key].find((rule) => rule.type);
        source[key] = initValue((typeObj == null ? void 0 : typeObj.type) || "string");
        return source;
      }, {});
    }
    set(target, key, value, proxy) {
      var _a, _b, _c;
      if (key !== "error" && target.hasOwnProperty(key)) {
        let type = (_b = (_a = this._rules[key].find((rule) => rule.type)) == null ? void 0 : _a.type) != null ? _b : "string";
        let transform = (_c = this._rules[key].find((rule) => rule.transform)) == null ? void 0 : _c.transform;
        if (transform) {
          value = transform(value);
        }
        type || (type = "string");
        const validate = () => {
          var _a2, _b2;
          const validator = new TypesValidator[type](this._rules[key], value, key, target);
          if (!validator.validate()) {
            (_a2 = this._error)[key] || (_a2[key] = []);
            this._error[key].push(...validator.error);
            (_b2 = this.proxy["error"])[key] || (_b2[key] = []);
            this.proxy["error"][key].push(...validator.error);
            return this._error;
          }
        };
        const job = { field: key, validate };
        this.queue.queueJob(job);
        this.queue.loopTick();
        if (type === "string" && typeOf(value) === "string")
          value = String.prototype.trim.call(value);
        return Reflect.set(target, key, value, proxy);
      } else {
        throw Error(`${key} is not a valid property`);
      }
    }
  }

  class ProxyValidator {
    constructor(rules, refValue, options) {
      this.source = {};
      this._rules = {};
      this.rules = rules;
      this._validator = new Validator(this._rules, refValue);
      this.source = this._validator.proxy;
    }
    get rules() {
      return this._rules;
    }
    set rules(value) {
      if (typeOf(value) === void 0 || typeOf(value) === null)
        throw new Error("ProxyValidator configuration parameter cannot be empty");
      if (typeOf(value) !== "object" || typeOf(value) === "array")
        throw new Error("ProxyValidator configuration parameter must be an object");
      this._rules = deepCopy(value);
      for (let key in this._rules) {
        if (!Array.isArray(this._rules[key]))
          this._rules[key] = [this._rules[key]];
      }
    }
    validate(fn) {
      return this._validator.queue.nextTick(fn);
    }
  }

  return ProxyValidator;

}));
