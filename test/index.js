const ProxyValidator = require("../dist/dist-web/bundle");
const source = {};

const validator = new ProxyValidator({
  v: {
    type: "url",
  },
});
var time = Date.now();
for (var i = 1; i <= 1000; i++) {
  var attack_str = "c1".repeat(i);
  validator.source.v = attack_str;
}
validator.validate((data) => {
  var time_cost = Date.now() - time;
  console.log(data, time_cost);
});
for (let i = 1; i <= 5000; i++) {
  source[`v${i}`] = { type: "url" };
}
const validator1 = new ProxyValidator(source);
var time = Date.now();
for (let i = 1; i <= 1000; i++) {
  var attack_str = "c1".repeat(i);
  validator1.source[`v${i}`] = attack_str;
}

validator1.validate((data) => {
  var time_cost = Date.now() - time;
  console.log(time_cost);
});
