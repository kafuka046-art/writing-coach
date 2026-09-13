# HANDOFF · Writing Coach 项目交接（更新 2026-09-13）

> 新对话开场直接说：**读 `C:\Users\61421\Documents\coach\HANDOFF.md`，接续 writing coach 项目。**
> 本文件是项目唯一入口。2026-08-19 起本项目由 Codex 全权负责。

## 一、一句话现状

单文件 AI 英语写作助手（入库学 → 出库用 → 对错回流 + 雅思 5/6/7 对标）。
2026-09-13 完成 **路线 A 落地**：浏览器直连 DeepSeek（线上不再需要后端）+ 模型更新为 V4.1 Flash + 主程序改名 `index.html` + 首次进入引导，部署到 GitHub Pages 供他人使用。
**终极目标：帮张旭拿秋招 offer**（产品/运营主攻，AI 公司 Kimi/MiniMax 用它做"AI 弹药"）。

## 二、线上地址与 Key 方案

- 在线：https://kafuka046-art.github.io/writing-coach/ （GitHub Pages，main 分支根目录）
- **Key 方案（2026-09-13 用户拍板）：路线 A —— 访客自备 Key**。你零成本、零风险、无备案问题
- 升级路径：若将来要"零门槛给陌生人用"→ 路线 B（服务端持有 Key + 限流 + 预算熔断），届时需承担费用与被刷风险，并注意生成式 AI 服务备案要求

## 三、文件地图

```
coach\
├── HANDOFF.md                # 本文件（项目入口）
├── index.html                # 主程序（单文件，UI+逻辑；线上与本地同一份）
├── proxy-server.js           # 本地开发可选代理（默认入口 index.html）
├── start.bat / start.sh      # 一键启动
├── README.md / LICENSE       # GitHub 文档
├── .nojekyll                 # GitHub Pages 用
├── docs\                     # 面试讲法 Q&A / 简历条目建议 / 演示脚本
├── dist\writing-coach-app\   # 打包副本（git 忽略）
└── writing-coach-app.zip     # 开箱即用包（git 忽略）
```

## 四、铁律

1. coach 是唯一真源；改动先 git commit（本地仓库 + GitHub remote 已配）
2. 代码改动必须本地跑通：`node proxy-server.js` → http://localhost:8768/
3. 模型名用 **`deepseek-flash`**（= DeepSeek-V4.1-Flash 正式名）；`deepseek-v4-flash` 是已退役旧名，仅临时兼容
4. 线上与本地是**同一份 index.html**，唯一差异是 API 路径（`API_ENDPOINT` 按 hostname 自动判断）
5. 简历正文唯一信息源是 `秋招补丁\简历信息底稿.md`；本项目材料先在 docs\ 起草
6. 不虚构经历；面试表述要能自证（链接/截图/录屏）
7. "音乐区线上活动策划"是投递作品非真实经历，与本项目无关，不得混入

## 五、Roadmap（优先级 = offer 价值）

- [x] 路线 A 落地：浏览器直连 + GitHub Pages
- [x] 题目图片送入多模态模型（V4.1 Flash 读图 → 概括题目 + 切题判断；客户端压缩 ≤1440px、最多发 4 张、失败降级纯文本）
- [ ] 语言点类条目纳入作文扫描（**闭环断点**：`check()` 只扫描 `type === "句式"`，提问式入库的"语言点"永远不参与检查）
- [ ] 纠错条目消解机制（用对后从"纠错"转"已掌握"）
- [ ] 流式输出（SSE）+ 请求超时/重试/取消
- [ ] 单元测试（extractLevel / findPattern / extractJsonArray / importLib）
- [ ] 录屏 + README 截图（面试官 60 秒看懂）

## 六、关键事实（可自证）

- 模型：`deepseek-flash` = DeepSeek-V4.1-Flash（官方文档确认；旧名 deepseek-v4-flash 已退役）
- **DeepSeek 原生支持 CORS**：实测 `OPTIONS /chat/completions` 返回 200 + 反射任意 Origin + `allow-headers: authorization,content-type` → 静态托管可直连，不需要后端
- 内置预设：5 条句式（PRESETS）+ 12 条语言点问答（QA_PRESETS）；无 Key 时语法检查走 4 条本地规则
- localStorage 键：`dsApiKey` / `writingCoachDraft` / `writingCoachLib4` / `writingCoachTarget` / `writingCoachTipClosed`
- 无 Key 也可体验完整闭环（引导栏已写明路径）

## 七、已知未修（诚实清单）

1. 闭环断点：语言点不入出库检查（见 Roadmap）
2. 纠错条目永不消解；知识点仍用字符串 `"ERROR:"` 传递错误，健壮性一般
3. 无流式输出、无超时重试；`topicImages` 刷新即丢（草稿会存、图片不存）
4. dist/ 与 zip 由根目录重新打包；改代码后记得重打包
5. 手机端只做了布局适配，未真机验证