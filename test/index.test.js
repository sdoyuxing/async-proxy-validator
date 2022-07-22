const ProxyValidator = require("../dist/dist-web/bundle");

test("test url", () => {
  const validator = new ProxyValidator({
    v: {
      type: "url",
      message: "v必须是url地址",
    },
  });
  validator.source.v = "asdf";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是url地址");
  });
  validator.source.v = "https://www.baidu.com";
  validator.validate((data) => {
    expect(data).toBe(undefined);
  });
});

test("test required", () => {
  const validator = new ProxyValidator(
    {
      v: {
        required: true,
        type: "string",
        message: "v是必填项",
      },
    },
    { v: "https://www.baidu.com" }
  );
  validator.source.v = "";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v是必填项");
  });
  validator.source.v = "https://www.baidu.com";
  validator.validate((data) => {
    expect(data).toBe(undefined);
  });
});

test("test number", () => {
  const validator = new ProxyValidator({
    v: [
      {
        type: "number",
        message: "v必须是数字",
      },
      { max: 10, message: "v不能大于10" },
      { min: 3, message: "v不能小于3" },
    ],
  });
  validator.source.v = "asd";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是数字");
  });

  validator.source.v = 5;
  validator.validate((data) => {
    expect(data).toBe(undefined);
  });

  validator.source.v = 21;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v不能大于10");
  });

  validator.source.v = 2;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v不能小于3");
  });
});

test("test number between", () => {
  const validator = new ProxyValidator({
    v: [
      {
        type: "number",
        message: "v必须是数字",
      },
      { max: 10, min: 3, message: "v要在10和3中间" },
    ],
  });
  validator.source.v = 18;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v要在10和3中间");
  });
});

test("test string", () => {
  const validator = new ProxyValidator({
    v: [
      {
        type: "string",
        message: "v必须是字符串",
      },
      { len: 6 },
    ],
  });

  validator.source.v = 123;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是字符串");
  });

  validator.source.v = "1234567";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v length must be 6");
  });

  const validator1 = new ProxyValidator({
    v: [
      {
        type: "string",
        message: "v必须是字符串",
      },
      { max: 6, message: "v长度要不大于6" },
      { min: 2, message: "v长度要不小于2" },
    ],
  });
  validator1.source.v = "1234567";
  validator1.validate((data) => {
    expect(data.v.join()).toBe("v长度要不大于6");
  });
  validator1.source.v = "1";
  validator1.validate((data) => {
    expect(data.v.join()).toBe("v长度要不小于2");
  });

  const validator2 = new ProxyValidator({
    v: [
      {
        type: "string",
        message: "v必须是字符串",
      },
      { max: 6, min: 2, message: "v长度要在6和2之间" },
    ],
  });

  validator2.source.v = "1";
  validator2.validate((data) => {
    expect(data.v.join()).toBe("v长度要在6和2之间");
  });
});

test("test array", () => {
  const validator = new ProxyValidator({
    v: [
      { type: "array", message: "v必须是数组" },
      { len: 6, message: "v长度必须是6" },
    ],
  });
  validator.source.v = 123;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是数组");
  });
  validator.source.v = [1, 2, 3, 4, 5];
  validator.validate((data) => {
    expect(data.v.join()).toBe("v长度必须是6");
  });

  const validator1 = new ProxyValidator({
    v: [
      { type: "array", message: "v必须是数组" },
      { max: 6, message: "v最大长度为6" },
      { min: 2, message: "v最小长度为2" },
    ],
  });
  validator1.source.v = [1, 2, 3, 4, 5, 6, 7];
  validator1.validate((data) => {
    expect(data.v.join()).toBe("v最大长度为6");
  });
  validator1.source.v = [1];
  validator1.validate((data) => {
    expect(data.v.join()).toBe("v最小长度为2");
  });
  const validator2 = new ProxyValidator({
    v: [
      { type: "array", message: "v必须是数组" },
      { max: 6, min: 2, message: "v最大长度在6和2之间" },
    ],
  });
  validator2.source.v = [1];
  validator2.validate((data) => {
    expect(data.v.join()).toBe("v最大长度在6和2之间");
  });
});

test("test boolean", () => {
  const validator = new ProxyValidator({
    v: [{ type: "boolean", message: "v必须是布尔值" }],
  });
  validator.source.v = 12;
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是布尔值");
  });
});

test("test Date", () => {
  const validator = new ProxyValidator({
    v: [
      { type: "date", message: "v必须是日期类型" },
      {
        max: new Date("2022-07-07"),
        message: "v必须小于今天",
      },
      { min: new Date("2022-07-03"), message: "v必须大于昨天" },
    ],
  });
  validator.source.v = "aaaa";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是日期类型");
  });
  validator.source.v = new Date("2022-07-08");
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须小于今天");
  });
  validator.source.v = new Date("2022-07-02");
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须大于昨天");
  });
  const validator1 = new ProxyValidator({
    v: [
      { type: "date", message: "v必须是日期类型" },
      {
        max: new Date("2022-07-07"),
        min: new Date("2022-07-03"),
        message: "v必须在明天天和昨天之间",
      },
    ],
  });
  validator1.source.v = new Date("2022-07-02");
  validator1.validate((data) => {
    expect(data.v.join()).toBe("v必须在明天天和昨天之间");
  });
});

test("test email", () => {
  const validator = new ProxyValidator({
    v: [{ type: "email", message: "v必须是email" }],
  });
  validator.source.v = "123";
  validator.validate((data) => {
    expect(data.v.join()).toBe("v必须是email");
  });
});

test("test transform", () => {
  const validator = new ProxyValidator({
    v: [
      { type: "number", message: "v必须是数字", transform: (val) => val * 10 },
    ],
  });
  validator.source.v = 1;
  expect(validator.source.v).toBe(10);
});

test("test pattern", () => {
  const validator = new ProxyValidator({
    v: [{ type: "string" }, { pattern: "^d{5}$", message: "只能是五位数字" }],
  });
  validator.source.v = "1234";
  validator.validate((data) => {
    expect(data.v.join()).toBe("只能是五位数字");
  });
});

test("test error", () => {
  const validaotor = new ProxyValidator({ v: [{ type: "string" }] });
  validaotor.source.v = "123";
  validaotor
    .validate((data) => {
      throw new Error("测试错误！");
    })
    .then(
      () => {},
      (error) => {
        expect(error.message).toBe("测试错误！");
      }
    );
});

test("test source error", () => {
  const validaotor = new ProxyValidator({ v: [{ type: "string" }] });
  validaotor.source.v = 123;
  validaotor.validate((data) => {
    expect(validaotor.source.error.v[0]).toBe("v is not a string");
  });
});

test("test linkage field", () => {
  const validaotor = new ProxyValidator({
    v: [
      {
        type: "number",
        validator(val, target) {
          if (val > target.a) return "v必须比a小";
        },
      },
    ],
    a: [{ type: "number" }],
  });
  validaotor.source.v = 10;
  validaotor.source.a = 5;
  validaotor.validate((data) => {
    expect(validaotor.source.error.v[0]).toBe("v必须比a小");
  });
});
