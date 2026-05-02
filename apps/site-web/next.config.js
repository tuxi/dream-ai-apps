const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/": ["./messages/**/*"],
    },
  },
  images: {
    remotePatterns: [
      // 阿里云 OSS — 替换为实际的 bucket hostname
      // 格式: <bucket>.<region>.aliyuncs.com
      ...(process.env.NEXT_PUBLIC_OSS_HOST
        ? [
            {
              protocol: "https",
              hostname: new URL(process.env.NEXT_PUBLIC_OSS_HOST).hostname,
            },
          ]
        : []),
    ],
  },
}

module.exports = withNextIntl(nextConfig)
