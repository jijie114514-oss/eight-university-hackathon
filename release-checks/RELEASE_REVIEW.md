# GitHub 发布检查 · 2026-10-17

## 输入与结论

输入：八校黑客松-完整项目-第一及第二阶段-2026-10-17.zip。
SHA256：`b4012e6f35f86773105c7d416de0511ed2a4dfae0a1fc1a34209403f49612e72`，与用户提供校验文件一致；输入清单 990 个文件全部匹配。

在下述已验证范围内未发现功能性阻断问题，可作为演示及开发源码发布。不能据此保证没有任何缺陷，也不代表完整实时跨境产品已验收。

## 执行结果

环境：macOS、Node.js 24.21.0。

| 项目 | 结果 |
| --- | --- |
| 最新整合版 A部分/app | npm ci；修复后 npm run verify：42 文件、584 测试通过，Lint、类型检查和 production build 通过 |
| 第一阶段 resilience-travel-assistant | 19 文件、267 测试通过，Lint、类型检查和 production build 通过 |
| 第二阶段信息 | 20 文件、267 测试通过，Lint、类型检查和 production build 通过 |
| UI 原型 | pnpm 10.34.3 frozen-lockfile 安装及 Vite build 通过 |
| 启动器 | node --check deploy-local.mjs 通过 |
| 整合版生产 HTTP | /、/journey、/journey-team、health、transit-status 均 200；三个演示情景正常，非法输入 400 |
| 香港数据 | 9,466 站点、2,452 路线加载成功 |
| 浏览器正常跨境示例 | 三个口岸候选；落马洲推荐、Plan B 展示 |
| 黑色暴雨 | 暂缓，无当前推荐 |
| 东铁中断 | 深圳湾推荐 |
| 第一阶段浏览器提交 | 正常情景得到 08:09 出发及 Plan B |
| 手机布局 | 两阶段 390px 宽度未发现横向溢出 |
| 浏览器未捕获异常 | 上述检查未发现 |

## 发布修复

三套 Next.js 应用更新 PostCSS 至 8.5.30，并覆盖间接依赖；postcss-selector-parser 覆盖至 7.1.6；Vitest 升级至 5.0.5，配置从 esbuild JSX 迁移至 oxc JSX，Node engines 与新测试工具保持一致。修复后全部测试及构建再次通过。根目录推荐 Node.js 24。

生产依赖 npm audit --omit=dev 无已知漏洞。完整审计仍有 7 项 high，根因为 braces <=3.0.3 深度嵌套 glob 的栈耗尽拒绝服务，经 Tailwind/ESLint 开发依赖传播；检查时 npm 上最新版仍为 3.0.3，没有直接修复版本。未进行 Tailwind/Next.js 的大版本重写；这些告警未宣称已修复。历史 ZIP 与 UI 原型未进行完整安全升级。

针对明文源码及嵌套 ZIP 扫描常见凭据格式和私有环境文件：未发现私有 .env；历史 Figma 网页快照的两个 api_key 字段及测试包 ZIP 内副本已替换为 REDACTED_FOR_PUBLIC_RELEASE。扫描不是完整安全审计。

保留原始目录和历史 ZIP，忽略安装产物、构建产物、缓存与日志。旧清单仅代表输入文件，当前发布内容由新清单和 Git 提交标识。

## 未验证范围

未配置或请求用户真实高德密钥；未验证深圳实时公交、全部香港实时外部接口、每个任意地址与跨境方向、真实手机定位、Windows 启动、完整人工读屏和真人任务测试。当前条件下这些功能不能标成已验收。当前仓库是源码发布，不是线上网站。
