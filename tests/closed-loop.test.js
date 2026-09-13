// 仿写闭环回归测试：用 vm + 假 DOM 直接加载 index.html 里的内联脚本，无需浏览器
// 运行：node tests/closed-loop.test.js
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const HTML = path.join(__dirname, "..", "index.html");
const src = fs.readFileSync(HTML, "utf8");
const js = src.slice(src.indexOf("<script>") + 8, src.indexOf("</script>"));

function elStub(id) {
  return { id: id, value: "", innerHTML: "", textContent: "", className: "", title: "", disabled: false,
    style: {}, dataset: {}, addEventListener: function () {}, appendChild: function () {}, remove: function () {}, focus: function () {} };
}
const els = {};
const doc = {
  getElementById: function (id) { if (!els[id]) els[id] = elStub(id); return els[id]; },
  querySelectorAll: function () { return []; },
  createElement: function (t) { return elStub(t); },
  addEventListener: function () {},
  body: { appendChild: function () {}, removeChild: function () {} }
};
const store = {};
const localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function (k, v) { store[k] = String(v); },
  removeItem: function (k) { delete store[k]; }
};
const ctx = { document: doc, localStorage: localStorage, console: console, Date: Date, Math: Math, JSON: JSON,
  fetch: function () { throw new Error("测试环境不联网"); }, location: { hostname: "localhost", protocol: "http:" },
  setTimeout: setTimeout, clearTimeout: clearTimeout, alert: function (m) { console.log("[alert] " + m); } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(js, ctx);

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; console.log("PASS  " + name); } else { fail++; console.log("FAIL  " + name); } }
function last() { return ctx.library[ctx.library.length - 1]; }

(async function () {
  // 1. JSON 抽取
  var o1 = ctx.extractJsonObject("```json\n{\"ok\":true,\"target\":\"Not only did\",\"fixed\":\"\",\"why\":\"位置对\"}\n```");
  ok("extractJsonObject 解析代码块包裹的 JSON", !!(o1 && o1.ok === true && o1.why === "位置对"));
  var o2 = ctx.extractJsonObject("好的，结果如下：{\"ok\":false,\"why\":\"没用到句式\"} 以上");
  ok("extractJsonObject 能从废话中抠出对象", !!(o2 && o2.ok === false));
  ok("extractJsonObject 非法输入返回 null", ctx.extractJsonObject("这里没有 json") === null);
  ok("extractJsonObject 对数组返回 null", ctx.extractJsonObject("[1,2,3]") === null);

  // 2. 回流知识库：入库 / 去重 / 纠错消解
  ctx.library.length = 0;
  var entry = { id: "e1", pattern: "not only ... but also", grammar: "并列结构；句首倒装", position: "句中或句首",
    level: "7分", source: "预置范文", example: "Not only did sales rise, but also costs fell." };
  ctx.library.push(entry);

  ctx.storePractice(false, entry, "Sales rise and costs fell.", { ok: false, fixed: "Not only did sales rise, but also costs fell.", why: "没用目标句式" }, "（AI 判断）");
  ok("练错 -> 新增 1 条纠错", ctx.library.length === 2 && last().type === "纠错" && last().pattern === "仿写：not only ... but also");
  ok("练错 -> 保留修正句", String(last().example).indexOf("Not only did") === 0);

  ctx.storePractice(true, entry, "Not only did sales rise, but also costs fell.", { ok: true, fixed: "" }, "（AI 判断）");
  ok("再练对 -> 不新增条目（去重）", ctx.library.length === 2);
  ok("再练对 -> 纠错消解为已掌握，pattern 复原", last().type === "已掌握" && last().pattern === "not only ... but also");

  ctx.storePractice(false, entry, "Sales rise quickly.", { ok: false, why: "又没用到" }, "（AI 判断）");
  ok("再练错 -> 翻回纠错且不新增", ctx.library.length === 2 && last().type === "纠错");
  ok("回流写入 localStorage", !!store["writingCoachLib4"] && store["writingCoachLib4"].indexOf("仿写：") !== -1);

  // 3. 无 Key 时的本地降级路径（真正调用 submitPractice）
  function runPractice(sentence, position) {
    ctx.library.length = 0;
    ctx.library.push({ id: "e9", pattern: "not only ... but also", grammar: "并列结构", position: position, level: "7分" });
    var bx = elStub("practiceBox"); bx.dataset.entryId = "e9"; els["practiceBox"] = bx;
    var inp = elStub("practiceInput"); inp.value = sentence; els["practiceInput"] = inp;
    els["practiceResult"] = elStub("practiceResult"); els["practiceBtn"] = elStub("practiceBtn");
    return ctx.submitPractice().then(function () { return { lib: ctx.library, html: els["practiceResult"].innerHTML }; });
  }

  var r1 = await runPractice("Not only did sales rise, but also costs fell.", "句中或句首");
  ok("无 Key 用对 -> ✅ 且回流已掌握", r1.html.indexOf("✅") !== -1 && r1.lib[1].type === "已掌握" && r1.lib[1].source === "仿写闭环");

  var r2 = await runPractice("Sales rose quickly.", "句中或句首");
  ok("无 Key 没用到句式 -> ❌ 且入库纠错", r2.html.indexOf("❌") !== -1 && r2.lib[1].type === "纠错");

  var r3 = await runPractice("Sales rose, not only did costs fall, but also profits grew.", "句首");
  ok("要求句首却放在中段 -> ❌ 位置提醒", r3.html.indexOf("没放在句首") !== -1 && r3.lib[1].type === "纠错");

  var r4 = await runPractice("Not only did sales rise, but also costs fell.", "句首");
  ok("要求句首且真在句首 -> ✅ 已掌握", r4.html.indexOf("✅") !== -1 && r4.lib[1].type === "已掌握");

  var r5 = await runPractice("Over the period, the trend reversed.", "句中或句首");
  ok("完全没用上 -> 提示没出现目标句式", r5.html.indexOf("没出现目标句式") !== -1);

  var bx2 = elStub("practiceBox"); bx2.dataset.entryId = "e9"; els["practiceBox"] = bx2;
  var inp2 = elStub("practiceInput"); inp2.value = "   "; els["practiceInput"] = inp2;
  els["practiceResult"] = elStub("practiceResult"); els["practiceBtn"] = elStub("practiceBtn");
  var before = ctx.library.length;
  await ctx.submitPractice();
  ok("空输入 -> 提示先写一句，不入库", els["practiceResult"].textContent === "先写一句再检查。" && ctx.library.length === before);

  console.log("\n==== " + pass + " passed, " + fail + " failed ====");
  process.exit(fail === 0 ? 0 : 1);
})();