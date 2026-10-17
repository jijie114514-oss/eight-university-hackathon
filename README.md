# 八校黑客松 · 韧性出行助手

第一阶段通勤决策、第二阶段港深跨境行程规划，以及团队交付、UI 原型和研究资料的完整项目仓库。

## 在线访问

<https://eight-university-hackathon.vercel.app>

首页即第二阶段港深跨境行程规划；第一阶段通勤演示在 `/phase1`。线上环境需在 Vercel 项目里配置 `DASHSCOPE_API_KEY`，否则「AI 行程解读」显示尚未启用。

## 运行最新整合版

安装 Node.js 24，在仓库根目录执行：

```sh
node deploy-local.mjs integrated
```

打开 http://localhost:3100/ 。第二阶段（港深跨境）为首页，第一阶段通勤在 http://localhost:3100/phase1 。

也可以手动运行：

```sh
cd A部分/app
npm ci
npm run verify
npm run start -- --hostname 127.0.0.1 --port 3100
```

## 目录

| 目录 | 用途 |
| --- | --- |
| `A部分/app/` | 最新整合版，包含第一、第二阶段 |
| `resilience-travel-assistant/` | 第一阶段独立应用 |
| `第二阶段信息/` | 第二阶段历史基线；最新功能请用整合版 |
| `ui-review-prototype/` | React/Vite UI 参考原型 |
| `analysis/`、`progress-*/`、`generated/` | 研究、评审、进度及素材 |
| `assets/brand/` | 团队 logo 源文件（`team-logo-original.png` 为当前版，`team-logo-legacy-blue.png` 为旧版留档） |
| 历史 ZIP、PDF、DOCX、Pages | 原始交付和参考资料，保留用于追溯 |
| `release-checks/` | 本次发布检查报告及结果 |

详细安装说明：[完整项目本地部署说明](完整项目本地部署说明.md)。

## 验证与使用边界

2026-10-17 在 macOS / Node.js 24.21.0 上，三套应用共 **1,118 项测试**、Lint、TypeScript 和生产构建通过；UI 原型构建通过。生产依赖审计为 0 项已知漏洞。开发依赖仍有 braces 引起的 7 项高危审计告警，详见 [发布检查报告](release-checks/RELEASE_REVIEW.md)。测试通过不代表所有实时服务或任意路线均已验收。

固定示例不需要密钥；公开交通规划依赖网络。香港段使用 GTFS 静态快照，非实时 ETA。深圳公交需要自行配置服务器端 `AMAP_WEB_SERVICE_KEY`，本仓库不包含真实密钥；本次未验证带密钥的深圳实时服务。未配置时不可视为完整跨境服务已接通。

本次发布为 GitHub 源码仓库，并已部署到 Vercel：<https://eight-university-hackathon.vercel.app> 。应用含服务端 API，运行时需要 Node.js 服务；Vercel 项目的 Root Directory 设为 `A部分/app`，否则构建会因根目录没有 `package.json` 而失败。

`PACKAGE-MANIFEST.json` 与原验证文档保留为输入 ZIP 的历史记录；发布依赖升级、脱敏和新增文件请以 Git 提交及 `release-checks/RELEASE_MANIFEST.json` 为准。历史交付 ZIP 未统一升级依赖，请勿直接视为当前推荐运行版本。

## 真实大模型解读（2026-10-17）

最新整合版 `A部分/app` 已在 `/api/decision`、`/api/journey`、`/api/team-journey` 接入阿里云百炼 `qwen-plus`，对应页面显示独立的「AI 行程解读」。原有路线、ETA、风险、主路与备选均由原规则计算，模型只生成附加说明。演示路线仍标记为 fixture；接入模型不代表实时交通数据已完整接通。

在 `A部分/app/.env.local` 配置服务端 `DASHSCOPE_API_KEY`，可选 `DASHSCOPE_BASE_URL`、`DASHSCOPE_MODEL`，模板见该应用的 `.env.example`。环境文件已被 Git 忽略，密钥不得使用 `NEXT_PUBLIC_` 前缀。部署平台需配置相同的服务端环境变量。修改环境配置后重启服务；源代码更新后重新构建并启动，或使用开发模式。

模型超时（8 秒）、认证失败、限流、空白或截断输出、新增数字或概率时，显示「AI 解读暂时无法取得」并保留规则结果；未配置时明确显示尚未启用。解读不替代官方信息核实。

验证：595 项测试、Lint、TypeScript、生产构建通过；真实 API 验证覆盖通勤、正常跨境、黑雨暂停及正式团队行程。上述验证针对本次新增模型接线。
