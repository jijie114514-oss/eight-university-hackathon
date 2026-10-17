# 八校黑客松 · 韧性出行助手

第一阶段通勤决策、第二阶段港深跨境行程规划，以及团队交付、UI 原型和研究资料的完整项目仓库。

## 运行最新整合版

安装 Node.js 24，在仓库根目录执行：

```sh
node deploy-local.mjs integrated
```

打开 http://localhost:3100/journey 。第一阶段入口为 http://localhost:3100/ 。

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
| 历史 ZIP、PDF、DOCX、Pages | 原始交付和参考资料，保留用于追溯 |
| `release-checks/` | 本次发布检查报告及结果 |

详细安装说明：[完整项目本地部署说明](完整项目本地部署说明.md)。

## 验证与使用边界

2026-10-17 在 macOS / Node.js 24.21.0 上，三套应用共 **1,118 项测试**、Lint、TypeScript 和生产构建通过；UI 原型构建通过。生产依赖审计为 0 项已知漏洞。开发依赖仍有 braces 引起的 7 项高危审计告警，详见 [发布检查报告](release-checks/RELEASE_REVIEW.md)。测试通过不代表所有实时服务或任意路线均已验收。

固定示例不需要密钥；公开交通规划依赖网络。香港段使用 GTFS 静态快照，非实时 ETA。深圳公交需要自行配置服务器端 `AMAP_WEB_SERVICE_KEY`，本仓库不包含真实密钥；本次未验证带密钥的深圳实时服务。未配置时不可视为完整跨境服务已接通。

本次发布为 GitHub 源码仓库。应用含服务端 API，运行时需要 Node.js 服务；尚未发布在线网站。

`PACKAGE-MANIFEST.json` 与原验证文档保留为输入 ZIP 的历史记录；发布依赖升级、脱敏和新增文件请以 Git 提交及 `release-checks/RELEASE_MANIFEST.json` 为准。历史交付 ZIP 未统一升级依赖，请勿直接视为当前推荐运行版本。
