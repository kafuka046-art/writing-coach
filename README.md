# Writing Coach · AI 英语写作助手

> 模拟"人脑知识库"的英语写作学习工具：**入库学新表达，出库写作检查，对错自动回流知识库**，对标雅思 5/6/7 分能力段。

**在线直接用** → https://kafuka046-art.github.io/writing-coach/

零安装。没有 API Key 也能用内置预设跑通完整闭环；想用 AI 讲解和作文检查，填一个自己的 DeepSeek Key 即可（Key 只存在你自己的浏览器里）。

## 为什么做这个

背了很多高分表达却用不出来？这个工具把英语写作学习变成一个**闭环**：

- **入库（学）**：把不会的句子 + 你的问题交给 AI，按 8 段教学结构精细讲解，存入个人知识库
- **出库（用）**：写作文交给 AI 检查语法 + 扫描句式，**用对**自动入库「已掌握」、**用错**自动入库「纠错」
- **对标（考）**：每条表达标注 5/6/7 分（对应雅思 GRA 能力段），按目标分数自动过滤推荐

## 功能

- 🧠 **人脑知识库**：每一条学过的表达都沉淀下来
- ✍️ **8 段教学讲解**：核心规则 → 原理拆解 → 复原语序 → 混淆对比 → 仿写 → 总结
- 🔁 **对错自动回流**：写作输出变成学习输入
- 🎯 **雅思对标**：5/6/7 能力段 + 目标分数过滤 + 水平分析与冲分建议
- 🎤 **语音输入**：每个输入框都能说，支持中/英（Chrome / Edge）
- 🖼️ **题目图片**：Ctrl+V 粘贴或上传
- 💾 **数据自持**：localStorage 本地存储，一键导入/导出 JSON 备份，草稿自动保存
- 🔌 **离线可用**：不填 API Key 也能用内置预设体验完整流程

## 使用方式

### 方式一：在线版（推荐）

打开 https://kafuka046-art.github.io/writing-coach/

- **没有 Key**：走内置预设（5 条句式 + 12 条语言点问答 + 规则语法检查），完整闭环可体验
- **有 Key**：填 [DeepSeek API Key](https://platform.deepseek.com/api_keys)（有免费额度）→ 保存 → AI 讲解、AI 作文检查全部启用

### 方式二：本地运行（改代码 / 离线用）

```bash
node proxy-server.js
# 浏览器打开 http://localhost:8768/
```

> 不要直接双击 HTML 用 file:// 打开：语音需要 localhost，AI 调用也可能被浏览器安全策略拦。

### 方式三：单文件带走

`index.html` 是自包含单文件（UI + 逻辑全在里面），可单独保存/分享。

## 项目结构

```
writing-coach/
├── index.html            # 主程序（单文件，全部 UI + 逻辑；线上与本地同一份）
├── proxy-server.js       # 本地开发可选代理：静态服务 + 转发 DeepSeek
├── start.bat / start.sh  # 一键启动（Windows / macOS + Linux）
├── docs/                 # 面试讲法 / 简历条目建议 / 演示脚本
├── HANDOFF.md            # 项目交接与 Roadmap
└── README.md / LICENSE
```

## 技术说明

- **纯前端单文件**：HTML + CSS + 原生 JS，无框架、无构建
- **AI 调用路径**：本地走 Node 代理 `/api/chat`；静态托管时浏览器**直连** `https://api.deepseek.com/chat/completions`——DeepSeek API 原生支持 CORS（OPTIONS 预检返回 200 且反射 Origin），因此**线上不需要任何后端**
- **模型**：`deepseek-flash`（DeepSeek-V4.1-Flash）
- **持久化**：localStorage（知识库 / 草稿 / 目标分数 / API Key）
- **语音**：Web Speech API（浏览器原生）
- **本地代理的安全处理**：仅绑定 127.0.0.1、Host 头校验（防 DNS rebinding）、请求体 2MB 上限、路径穿越防护

## 隐私

- **API Key 只存在你自己的浏览器**（localStorage），直接发往 DeepSeek，不经过本项目任何服务器
- 知识库、作文草稿同样只在本地，可随时导出 JSON 备份
- 没有账号系统、没有埋点、不收集任何用户数据

## Roadmap

- [x] 浏览器直连（去掉线上对后端的依赖）
- [x] 移动端布局适配（需真机复查）
- [ ] 题目图片送入多模态模型（V4.1 Flash 原生支持图片输入，当前图片仅作展示）
- [ ] 语言点类条目纳入作文扫描（目前只有「句式」类参与出库检查）
- [ ] 流式输出（SSE）+ 请求超时/重试
- [ ] 单元测试（等级解析 / 句式匹配 / 导入导出）
- [ ] 可选：服务端 Key + 限流（让没有 Key 的人也能用 AI）

## License

MIT © [kafuka046-art](https://github.com/kafuka046-art/)