# proxy-validator

异步验证表单字段，通过 Proxy 的方式实现表单验证，支持 Proxy 的浏览器才能使用。

## 安装

```bash
npm i proxy-validator
```

## 使用

申明一个字段校验规则对象作为参数传给 ProxyValidator，返回一个代理对象，对象中的属性赋值后通过 validate 方法获取校验结果信息。

```js
import ProxyValidator from "proxy-validator";
var data = new ProxyValidator({
  name: {
    type: "number",
    required: true,
  },
});
data.source.name = "123";
data.validate(function (data) {
  console.log(data);
});
```

## API

### Validate

```js
function(): Promise
```

返回会返回一个 Promise 对象:

- `then()`，验证通过
- `catch({ errors, fields })`，验证失败会返回失败信息和对应字段

### Rules

规则是一个对象数组，对指定的对象进行校验，如下:

```js
const descriptor = {
  email: [
    { type: "string", required: true },
    {
      validator(value) {
        const errors = [];
        // test if email address already exists in a database
        // and add a validation error to the errors array if it does
        return errors;
      },
    },
  ],
};
```

#### Type

检验器可以校验的类型有:

- `string`: 字符串
- `number`: 数字.
- `boolean`: 布尔.
- `array`: 数组.
- `object`: 对象.
- `date`: 日期
- `url`: url 地址.
- `email`: 邮箱地址.

#### 必填

`required`:配置字段必须有值.

#### 范围

通过`main`和`min`属性设置访问，`array`和`string`类型是设置长度的范围，`number`和`Date`类型是设置值的范围。

#### 长度

通过`len`属性设置长度，作用在`array`和`string`类型。





### Transform
