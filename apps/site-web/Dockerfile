# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建时注入生产环境变量（NEXT_PUBLIC_* 会打包进前端代码）
# 生产环境构建命令示例:
#   docker build \
#     --build-arg NEXT_PUBLIC_SITE_API_BASE_URL=https://api.dreamlog.com/api/v1 \
#     --build-arg NEXT_PUBLIC_OSS_HOST=https://your-bucket.oss-cn-hangzhou.aliyuncs.com \
#     -t dreamlog-site .
ARG NEXT_PUBLIC_SITE_API_BASE_URL
ARG NEXT_PUBLIC_OSS_HOST
ENV NEXT_PUBLIC_SITE_API_BASE_URL=$NEXT_PUBLIC_SITE_API_BASE_URL
ENV NEXT_PUBLIC_OSS_HOST=$NEXT_PUBLIC_OSS_HOST

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 模式输出的最小运行时
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
