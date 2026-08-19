# HANDOFF · Writing Coach 项目交接（2026-08-19）

> 新对话开场直接说：**读 `C:\Users\61421\Documents\coach\HANDOFF.md`，接续 writing coach 项目。**
> 本文件是项目唯一入口：现状、目标、文件地图、铁律、Roadmap 都在这里，无需重新探索。
> 2026-08-19 起本项目由 Codex 全权负责。

## 一、一句话现状
单文件 AI 英语写作助手（学→用→回流闭环 + 雅思5-7对标），代码可用、已推 GitHub；
**终极目标：帮张旭拿秋招 offer**（产品/运营主攻，AI 公司第二梯队 Kimi/MiniMax 用它做"AI 弹药"）。

## 二、项目定位（对 offer 的价值）
- **面试讲法**：AI 产品思维（学习闭环/对错回流/能力对标）+ 工程实现（本地代理、CORS、安全防护、localStorage 数据自持）
- **作品集/投递**：GitHub 仓库 kafuka046-art/writing-coach + 可演示
- **简历条目**：一条"产品+技术"结合的项目经历（尚未写入 秋招补丁\简历信息底稿.md，见 Roadmap P0）

## 三、文件地图
```
coach\
├── HANDOFF.md                # 本文件（项目入口）
├── writing-coach-demo.html   # 主程序（单文件，全部 UI+逻辑）
├── proxy-server.js           # 本地代理：静态服务 + 转发 DeepSeek（解决 CORS）
├── start.bat / start.sh      # 一键启动
├── README.md / LICENSE       # GitHub 文档
├── dist\writing-coach-app\   # 打包副本（git 忽略，不直接改）
└── docs\                     # 材料目录（简历弹药/面试讲法，git 跟踪）
```

## 四、铁律
1. coach 是唯一真源；改动先 git commit（本地仓库 + GitHub remote 已配）
2. 代码改动必须本地跑通：`node proxy-server.js` → http://localhost:8768/
3. 简历正文唯一信息源是 `秋招补丁\简历信息底稿.md`；本项目材料先在 docs\ 起草，定稿后由简历流程并入底稿
4. 不虚构经历；"音乐区线上活动策划"是投递作品非真实经历，与 writing coach 无关，不得混入
5. 涉及面试/投递的表述，数据要能自证（功能截图、演示录屏、GitHub 链接）

## 五、Roadmap（优先级 = offer 价值）
- [ ] **P0 拿 offer 弹药**：简历条目 + 项目经历段落 + 面试 Q&A 讲法 → docs\
- [ ] **P0 可演示性**：本地跑通验证 + 功能截图/录屏 + README 演示指引
- [ ] **P1 代码加分**：移动端适配 / 多 LLM 接入 / GitHub Pages 静态演示版
- [ ] **P2 大功能**：用户系统+多端同步 / Whisper ASR（原 README Roadmap）

## 六、当前状态（2026-08-19）
- 代码：git 干净，4 提交，最后一次 8/6
- 权限：coach 目录需用户授权 Codex 写入（8/19 已申请）
- 下一步：Roadmap P0
