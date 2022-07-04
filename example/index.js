
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ProxyValidator = factory());
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
        return typeOf(val) === "date" || !isNaN(new Date(val).getTime());
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
    return typeOf(val) === "number" || typeOf(val) === "Date";
  }
  const value = (val, valOptin) => {
    if (isNumOrDate(val)) {
      val = typeOf(val) === "Date" ? val.getTime() : val;
      const max = isNumOrDate(valOptin.max) && typeOf(valOptin.max) === "Date" ? valOptin.max.getTime() : valOptin.max;
      const min = isNumOrDate(valOptin.min) && typeOf(valOptin.min) === "Date" ? valOptin.min.getTime() : valOptin.min;
      if (max && !min && val > max) {
        return "max";
      } else if (min && !max && val < min) {
        return "min";
      } else if (min && max && (max < val || val < min)) {
        return "between";
      }
    }
    return "";
  };

  var rule = {
    type,
    required,
    len,
    val: value
  };

  class MainType {
    constructor(rule2, value, field) {
      this._message = {};
      this.error = [];
      this._rule = {};
      this._field = "";
      Object.assign(this, { _rule: rule2, _value: value, _field: field });
    }
    validate() {
      return true;
    }
    validateTypes() {
    }
    validateRequired() {
      if (this._rule.required && !rule.required(this._value)) {
        this.error.push(this._rule.message || messageFormat(this._message.required, this._field));
      }
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
          this.error.push(messageFormat(this._message[messageType], this._field, ...[len, max, min].filter((item) => item)));
        }
      }
    }
    validateValue() {
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$6({
        type: "%s is not a number",
        between: "%s must be between %s and %s",
        max: "%s must be less than %s",
        min: "%s must be greater than %s"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateValue();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "number")) {
        this.error.push(this._rule.message || messageFormat(this._message.type, this._field));
      }
    }
    validateValue() {
      const { len, max, min } = this._rule;
      if (len || max || min) {
        const messageType = rule.val(this._value, { max, min });
        if (messageType) {
          this.error.push(messageFormat(this._message[messageType], this._field, ...[max, min].filter((item) => item)));
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$5({
        type: "%s is not a boolean"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "boolean")) {
        this.error.push(messageFormat(this._message.type, this._field));
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$4({
        type: "%s is not a array",
        between: "%s length must be between %s and %s",
        max: "%s length must be less than %s",
        min: "%s length must be greater than %s"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateLen();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "array")) {
        this.error.push(messageFormat(this._message.type, this._field));
      }
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$3({
        type: "%s is not a string",
        between: "%s length must be between %s and %s",
        max: "%s length must be less than %s",
        min: "%s length must be greater than %s"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateLen();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "string")) {
        this.error.push(messageFormat(this._message.type, this._field));
      }
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$2({
        type: "%s is not a date",
        between: "%s must be between %s and %s",
        max: "%s must be less than %s",
        min: "%s must be greater than %s"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateValue();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "date")) {
        this.error.push(messageFormat(this._message.type, this._field));
      }
    }
    validateValue() {
      const { max, min } = this._rule;
      if (max || min) {
        const messageType = rule.val(this._value, { max, min });
        if (messageType) {
          this.error.push(messageFormat(this._message[messageType], this._field, ...[max, min].filter((item) => item).map((item) => new Date(item).toString())));
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues$1({
        type: "%s is not a email"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateLen();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "email")) {
        this.error.push(messageFormat(this._message.type, this._field));
      }
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
    constructor(rule2, value, field) {
      super(rule2, value, field);
      this._message = __spreadValues({
        type: "%s is not a url"
      }, message);
    }
    validate() {
      this.validateRequired();
      if (!isEmptyValue(this._value))
        this.validateTypes();
      this.validateLen();
      if (this._rule.validator)
        this.error.push(this._rule.validator(this._value));
      return this.error.length === 0;
    }
    validateTypes() {
      if (!rule.type(this._value, "url")) {
        this.error.push(messageFormat(this._message.type, this._field));
      }
    }
  }

  var typesValidator = {
    number: InternalNumber,
    boolean: InternalBoolean,
    array: InternalArray,
    string: InternalString,
    date: InternalDate,
    email: InternalEmail,
    url: InternalUrl
  };

  class Queue {
    constructor() {
      this.isFlushPending = false;
      this.currentFlushPromise = Promise.resolve();
      this.queue = [];
      this.set = /* @__PURE__ */ new Set();
    }
    queueJob(job) {
      const internalJob = this.queue.find((item) => item.field === job.field);
      if (internalJob) {
        internalJob.validate = job.validate;
      } else {
        this.queue.push(job);
      }
      this.queueFlush();
    }
    queueFlush() {
      if (!this.isFlushPending) {
        this.isFlushPending = true;
        this.currentFlushPromise = Promise.resolve().then(() => {
          this.flushJobs();
        });
      }
    }
    flushJobs() {
      this.isFlushPending = false;
      if (this.queue.length > 0) {
        let result = "";
        try {
          for (let i = 0; i < this.queue.length; i++) {
            result = this.queue[i].validate();
            this.queue.splice(i, 1);
            i > 0 && i--;
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
        if (result)
          throw result;
      }
    }
    nextTick(fn) {
      const p = this.currentFlushPromise;
      if (fn && !this.set.has(fn)) {
        this.set.add(fn);
        p.then(this ? fn.bind(this) : fn, fn);
      }
      return p;
    }
  }

  const proxyMap = /* @__PURE__ */ new WeakMap();
  class Validator {
    constructor(rules, refValue) {
      this._rules = {};
      this._error = {};
      this.queue = new Queue();
      this._rules = rules;
      const existingProxy = proxyMap.get(rules);
      if (existingProxy) {
        this.proxy = existingProxy;
      } else {
        this.proxy = new Proxy(refValue || this.initSource(rules), {
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
      if (target.hasOwnProperty(key)) {
        this._rules[key].forEach((rule) => {
          let { type } = rule;
          type || (type = "string");
          const validate = () => {
            var _a;
            const validator = new typesValidator[type](rule, value, key);
            if (!validator.validate()) {
              (_a = this._error)[key] || (_a[key] = []);
              this._error[key].push(...validator.error);
              return this._error;
            }
          };
          const job = { field: key, validate };
          this.queue.queueJob(job);
        });
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
