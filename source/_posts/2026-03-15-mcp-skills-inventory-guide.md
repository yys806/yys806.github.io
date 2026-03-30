---
title: MCP与Skills全量清单（持续更新）
date: 2026-03-30 17:06:00
categories: 开发
tags: 公用
---


## 1. 我安装了哪些 MCP？它们分别有什么用？

我确认 MCP 配置来源文件是：

- `C:/Users/Lenovo/.config/opencode/opencode.json`

我当前一共配置了 9 个 MCP：

1. Framelink MCP for Figma
2. chrome-devtools
3. github
4. neon
5. pencil
6. puppeteer
7. replicate-flux-mcp
8. semgrep
9. stripe

### 1.1 我把 MCP 按接入方式分成两类

#### A. 我接入的远程云端 MCP

- github
- neon
- stripe

#### B. 我在本机启动的 MCP

- Framelink MCP for Figma（`npx figma-developer-mcp`）
- chrome-devtools（`npx chrome-devtools-mcp@latest`）
- puppeteer（`@modelcontextprotocol/server-puppeteer`）
- replicate-flux-mcp（`npx replicate-flux-mcp`）
- semgrep（`pysemgrep.exe mcp`）
- pencil（本地 exe 路径）

---

## 2. 我的 MCP 逐项说明（我装了什么、有什么用、从哪来）

| 我安装的 MCP | 我主要拿它做什么 | 我的接入形态 | 我的下载/接入来源 | GitHub/官方链接 | 归类 |
|---|---|---|---|---|---|
| Framelink MCP for Figma | 我用它读取 Figma 设计数据、下载设计素材，辅助前端还原 | 本地 `npx` 命令 | NPM 包 `figma-developer-mcp` | GitHub: https://github.com/GLips/Figma-Context-MCP | 互联网下载（第三方） |
| chrome-devtools | 我用它做页面操作、抓快照、看网络和性能 | 本地 `npx` 命令 | NPM 包 `chrome-devtools-mcp` | GitHub: https://github.com/ChromeDevTools/chrome-devtools-mcp | 互联网下载（官方/开源） |
| github | 我用它做 GitHub 相关交互（issue/PR/repo） | 远程 URL | `https://api.githubcopilot.com/mcp/` | 官方入口: https://docs.github.com/copilot | 互联网接入（云端服务） |
| neon | 我用它做 Neon 项目、分支、SQL 操作 | 远程 URL | `https://mcp.neon.tech/mcp` | 官网: https://neon.com | 互联网接入（云端服务） |
| pencil | 我用它操作 `.pen` 设计文件（读写、布局、导出） | 本地 EXE | 本地二进制 `D:/Pencil/.../mcp-server-windows-x64.exe` | 待核验（本机配置未写上游仓库） | 本地安装（来源待核验） |
| puppeteer | 我用它做浏览器自动化（导航、点击、填表、截图） | 本地 Node 模块命令 | `@modelcontextprotocol/server-puppeteer` | GitHub: https://github.com/modelcontextprotocol/servers | 互联网下载（开源） |
| replicate-flux-mcp | 我用它做文生图/图像生成（Flux） | 本地 `npx` 命令 | NPM 包 `replicate-flux-mcp` | 待核验（需以包仓库字段复核） | 互联网下载（第三方） |
| semgrep | 我用它做 SAST/SCA 安全扫描与规则匹配 | 本地 Python 可执行 | `pysemgrep.exe mcp`（Semgrep 体系） | GitHub: https://github.com/semgrep/semgrep | 互联网下载（开源） |
| stripe | 我用它做 Stripe 支付对象查询和操作 | 远程 URL | `https://mcp.stripe.com` | 官方文档: https://docs.stripe.com | 互联网接入（云端服务） |

### 2.1 哪些是我从网上下载/接入的？哪些是我自己做的？

#### 我可以明确判定为“互联网下载/接入”的

- Framelink MCP for Figma
- chrome-devtools
- github
- neon
- puppeteer
- replicate-flux-mcp
- semgrep
- stripe

#### 我暂时不能直接判定为“我自己开发”的

- pencil（我目前只在本机看到 exe 路径，没看到我自己的上游仓库指针）

> 结论（按现有证据）：我的 MCP 层里没有发现可以直接下结论为“我从零自研”的项目；`pencil` 目前只能定性为“本地部署，来源待核验”。

---

## 3. 我安装了哪些 Skills？

### 3.1 我本机扫描到的技能文件数量

- `C:/Users/Lenovo/.config/opencode/skills/**/SKILL.md`：29 个

### 3.2 我的核心技能集合（去重后，以 29 个主集合为准）

1. claude-mem/do  
2. claude-mem/make-plan  
3. claude-mem/mem-search  
4. claude-mem/smart-explore  
5. claude-mem/timeline-report  
6. docx  
7. find-skills  
8. frontend-design  
9. netlify-auto-deploy  
10. paper-2-web  
11. paper-deep-reading  
12. paper-experiment  
13. paper-literature  
14. pdf  
15. planning-with-files  
16. pptx  
17. pua  
18. pua-loop  
19. p7  
20. p9  
21. p10  
22. pro  
23. yes  
24. mama  
25. shot  
26. skill-creator  
27. web-access  
28. xlsx  
29. yt-dlp-downloader

---

## 4. 我的 Skills 分类别用途说明（我装了什么、有什么用）

### 4.1 规划 / 记忆 / 执行编排类

| Skill | 我用它做什么 | 来源线索 | GitHub/官网 | 归类 |
|---|---|---|---|---|
| do | 我用它执行分阶段实施计划 | `claude-mem/do` | 待核验（本机未声明） | 互联网安装（技能包） |
| make-plan | 我用它生成计划与文档探索路径 | `claude-mem/make-plan` | 待核验 | 互联网安装 |
| mem-search | 我用它检索跨会话记忆 | `claude-mem/mem-search` | 待核验 | 互联网安装 |
| smart-explore | 我用它做结构化代码探索 | `claude-mem/smart-explore` | 待核验 | 互联网安装 |
| timeline-report | 我用它输出项目时间线报告 | `claude-mem/timeline-report` | 待核验 | 互联网安装 |
| planning-with-files | 我用它管理复杂任务的文件化计划 | Skill front matter | 待核验 | 互联网安装 |
| find-skills | 我用它发现可安装技能 | Skill front matter | 待核验 | 互联网安装 |
| skill-creator | 我用它创建/升级技能 | Skill front matter | 待核验 | 互联网安装 |

### 4.2 文档与办公文件处理类

| Skill | 我用它做什么 | 上游生态（高概率） | GitHub/官网 | 归类 |
|---|---|---|---|---|
| docx | 我用它创建、编辑、解析 Word 文档 | python-docx 生态 | https://github.com/python-openxml/python-docx | 互联网下载 |
| pdf | 我用它做 PDF 提取、拆分合并和表单处理 | Python PDF 工具链 | 待核验（具体依赖未在 skill 明示） | 互联网下载 |
| pptx | 我用它创建和修改演示文稿 | python-pptx 生态 | https://github.com/scanny/python-pptx | 互联网下载 |
| xlsx | 我用它做表格读写、公式与数据分析 | openpyxl/pandas 生态 | https://github.com/ericgazoni/openpyxl | 互联网下载 |

### 4.3 前端 / 发布 / 媒体类

| Skill | 我用它做什么 | 来源线索 | GitHub/官网 | 归类 |
|---|---|---|---|---|
| frontend-design | 我用它生成和改造高质量前端界面 | Skill front matter | 待核验 | 互联网安装 |
| netlify-auto-deploy | 我用它做 Netlify 自动部署 | Skill front matter | https://github.com/netlify/cli | 互联网下载 |
| yt-dlp-downloader | 我用它下载视频、提取音频和字幕 | Skill front matter | https://github.com/yt-dlp/yt-dlp | 互联网下载 |
| web-access | 我用它做联网抓取和登录态网页操作 | Skill front matter 已给出 | https://github.com/eze-is/web-access | 互联网下载 |

### 4.4 学术研究与论文生产类

| Skill | 我用它做什么 | 来源线索 | GitHub/官网 | 归类 |
|---|---|---|---|---|
| paper-2-web | 我用它把论文转成网页/视频/海报 | Skill front matter | 待核验 | 互联网安装 |
| paper-deep-reading | 我用它做论文深读和公式/表格抽取 | Skill front matter | 待核验 | 互联网安装 |
| paper-experiment | 我用它做实验规划、复现和代码检索执行 | `.claude/skills/skill` 有本地化版本 | 自建版本待公开仓库 | 混合：互联网基础 + 本地定制 |
| paper-literature | 我用它做文献综述、写作润色和引用构建 | `.claude/skills/skill` 有本地化版本 | 自建版本待公开仓库 | 混合：互联网基础 + 本地定制 |

### 4.5 PUA 系列（执行模式与叙事风格增强）

| Skill | 我用它做什么 | 来源线索 | GitHub/官网 | 归类 |
|---|---|---|---|---|
| pua | 我用它进入高压执行模式 | `skills/pua/*` 家族 | 待核验 | 互联网安装或私有分发 |
| pua-loop | 我用它做自动迭代执行 | 同上 | 待核验 | 互联网安装或私有分发 |
| p7 | 我用它切换 P7 执行角色模式 | 同上 | 待核验 | 互联网安装或私有分发 |
| p9 | 我用它切换 P9 Tech Lead 模式 | 同上 | 待核验 | 互联网安装或私有分发 |
| p10 | 我用它切换 P10 CTO 模式 | 同上 | 待核验 | 互联网安装或私有分发 |
| pro | 我用它做 KPI/排行榜等扩展能力 | 同上 | 待核验 | 互联网安装或私有分发 |
| yes | 我用它切换夸夸叙事风格 | 同上 | 待核验 | 互联网安装或私有分发 |
| mama | 我用它切换妈妈唠叨叙事风格 | 同上 | 待核验 | 互联网安装或私有分发 |
| shot | 我用它做浓缩全量注入模式 | 同上 | 待核验 | 互联网安装或私有分发 |

---

## 5. 我对“下载的 vs 自己做的”的明确结论

### 5.1 我可以明确归为“下载/外部引入”的

- 我的 MCP 基本都属于外部下载或远程接入（至少 8/9 项明确）
- 我的 Skills 主集合（`.config/opencode/skills` 下 29 项）整体表现为已安装技能包

### 5.2 我可以明确归为“我本地定制成分明显”的

- `C:/Users/Lenovo/.claude/skills/skill/paper-literature/SKILL.md`
- `C:/Users/Lenovo/.claude/skills/skill/paper-experiment/SKILL.md`

这两个技能文件带有强本地路径和项目约束（例如 `D:/shen/research/doc`），我可以把它们认定为我自己的本地深度定制版本。

### 5.3 我还需要二次核验的

- `pencil` MCP 的上游来源
- 部分 skills 的上游 GitHub（本机 front matter 未写 repository 字段）

---

## 6. 我给自己的安全提醒（重要）

我在 `opencode.json` 里发现了明文敏感信息（例如部分 MCP token/header）。

我应该立即做三件事：

1. 把 token 改成环境变量注入，不再在 JSON 明文保存。  
2. 轮换已暴露凭证（至少 GitHub 和 Stripe 相关凭证）。  
3. 给配置文件增加本地访问控制，避免同步到公开仓库。  

---

## 附：我这次盘点的证据路径

- MCP 配置：`C:/Users/Lenovo/.config/opencode/opencode.json`  
- Skill 主目录：`C:/Users/Lenovo/.config/opencode/skills`  
- Skill 本地覆盖与定制：`C:/Users/Lenovo/.claude/skills`  
