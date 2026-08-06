# Writing Coach · AI 写作助手

> AI 驱动的英语写作学习工具，模拟"人脑知识库"：**入库学新表达，出库写作检查，对错自动回流知识库**，对标雅思 5/6/7 分能力段。

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 为什么做这个

背了很多高分表达却用不出来？这个工具把英语写作学习变成一个**闭环**：

- **入库（学）**：把不会的句子 + 你的问题交给 AI，按 8 段教学结构精细讲解，存入个人知识库
- **出库（用）**：写作文交给 AI 检查语法 + 扫描句式，**用对**自动入库「已掌握」、**用错**自动入库「纠错」
- **对标（考）**：每条表达标注 5/6/7 分（对应雅思 GRA 能力段），按目标分数自动过滤推荐

## 功能亮点

- 🧠 **人脑知识库**：每一条学过的表达都沉淀下来，越用越「懂你」
- ✍️ **8 段教学讲解**：核心规则 → 原理拆解 → 复原语序 → 混淆对比 → 仿写 → 总结
- 🔁 **对错自动回流**：用对/用错都自动入库，写作输出变成学习输入
- 🎯 **雅思对标**：5/6/7 分能力段 + 目标分数过滤 + 水平分析与冲分建议
- 🎤 **语音输入**：每个输入框都能说，支持中/英
- 🖼️ **题目图片**：Ctrl+V 粘贴或上传题目图片
- 💾 **数据自持**：localStorage 本地存储，一键导入/导出 JSON 备份，作文草稿自动保存
- 🔌 **离线可用**：不填 API Key 也能用内置预设体验完整流程

## 快速开始

### 环境要求

- **Node.js 18+**（用于本地代理，内置 fetch）
- **Chrome / Edge** 浏览器（语音输入需要麦克风权限）
- **DeepSeek API Key**（[platform.deepseek.com](https://platform.deepseek.com/api_keys) 申请，有免费额度；没有也能先体验）

### 一键启动

- **Windows**：双击 `start.bat`
- **macOS / Linux**：`./start.sh`

### 手动启动

```bash
node proxy-server.js
# 浏览器打开 http://localhost:8768/
```

> ⚠️ 不要直接双击 HTML 文件打开（file:// 协议下语音和 API 调用都会失败），必须通过 localhost 访问。

### 第一次使用

1. 页面顶部填入 DeepSeek API Key → 点「保存」，状态显示「已启用 AI 解释」
2. 左边贴句子 + 提问 → 「解释并入库」
3. 右边写作文 → 「检查并自动入库」
4. 定期点「导出库」备份知识库 JSON

## 项目结构

```
writing-coach/
├── writing-coach-demo.html   # 主程序（单文件，全部 UI + 逻辑）
├── proxy-server.js           # 本地代理：静态服务 + 转发 DeepSeek API（解决 CORS）
├── start.bat                 # Windows 一键启动
├── start.sh                  # macOS / Linux 一键启动
├── README.md
└── LICENSE
```

## 技术栈

- 纯前端：HTML + CSS + 原生 JS（无框架、无构建、单文件）
- localStorage 持久化（知识库 / 草稿 / 目标分数 / API Key）
- DeepSeek V4 Flash API（Node 本地代理转发，绕开浏览器 CORS）
- Web Speech API（语音输入，浏览器原生）

## 安全说明

- API Key 仅保存在本机浏览器 localStorage，代理不记录、不外传
- 代理只绑定 127.0.0.1 并校验 Host 头（防 DNS rebinding / 局域网滥用）
- `/api/chat` 请求体限制 2MB，静态文件带路径穿越防护

## Roadmap

- [ ] 接入更多 LLM（智谱 GLM / OpenAI）做对比
- [ ] 用户系统 + 多设备知识库同步
- [ ] 移动端适配
- [ ] 专业 ASR（Whisper）替代浏览器语音识别

## License

MIT © [kafuka046-art](https://github.com/kafuka046-art/)
