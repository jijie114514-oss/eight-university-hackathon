import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['eviltransform'],
  // 香港路网快照在运行时用 process.cwd() 读取，必须随每个 Serverless Function 一起打包。
  // 只列个别路由会导致 /api/decision、/api/team-journey 等在 Vercel 上读不到文件而 500。
  outputFileTracingIncludes: { '/*': ['./data/transit/hk-network.json.gz'] },
  reactStrictMode: true,
  // 默认输出到标准 .next，托管平台（Vercel 等）才能识别构建产物。
  // 本地如遇缓存冲突，用 NEXT_DIST_DIR=.next-b 覆盖即可。
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // ESLint 在 `npm run lint` 與 `npm run verify` 中單獨執行；建置時一併檢查，
  // 讓「主分支必須可建置」同時意味著「主分支必須通過 lint」。
  eslint: { ignoreDuringBuilds: false },
  env: {
    APP_VERSION: process.env.APP_VERSION ?? "0.1.0",
  },
};

export default nextConfig;
