# 官网 V1 上线需求文档

## 1. 文档目的

本文档定义官网 `apps/site-web` **第一版正式上线**所需完成的全部工作，目标是将网站部署至云服务器并通过域名公开访问，以满足 App Store 上架和国内 ICP 备案的前置要求。

本文档不涉及功能迭代，只关注"能上线、备得了案"这一目标。

---

## 2. 上线目标

| 目标 | 说明 |
|------|------|
| 网站可通过域名公开访问 | 绑定 `dreamlog.com`，国内外用户均可访问 |
| 隐私政策页面有效 | `/privacy` 页面包含真实、完整的隐私政策文本 |
| 用户协议页面有效 | `/terms` 页面包含真实、完整的用户协议文本 |
| 首页内容完整 | Hero、Features、FAQ、下载链接等关键内容已录入后台 |
| 关于页内容真实 | `/about` 页面替换为对外展示的品牌介绍内容 |
| 部署稳定可维护 | 具备 Dockerfile 和 Nginx 配置，支持基本的重启和更新 |

---

## 3. 当前状态盘点

### 3.1 已完成，无需额外工作

- 完整的页面路由结构（首页、功能、FAQ、博客、下载、联系、隐私、协议）
- 官网前台所有页面与后端 API 联调完成
- 后台管理系统登录、Site CMS 全模块（config / features / faqs / posts / download-links）
- 后台 OSS 图片直传能力
- Admin Console 用户管理、计费管理页面

### 3.2 需要补充的内容

| 编号 | 项目 | 类型 | 阻塞上线 |
|------|------|------|---------|
| C1 | 隐私政策正文 | 内容 | ✅ 是 |
| C2 | 用户协议正文 | 内容 | ✅ 是 |
| C3 | 后台录入基础内容数据 | 内容 | ✅ 是（首页否则为空） |
| C4 | 关于页替换为品牌内容 | 代码 | 否 |

### 3.3 需要新增的技术配置

| 编号 | 项目 | 类型 | 阻塞上线 |
|------|------|------|---------|
| T1 | Dockerfile | 部署 | ✅ 是 |
| T2 | Nginx 反向代理配置 | 部署 | ✅ 是 |
| T3 | 生产环境变量配置 | 部署 | ✅ 是 |
| T4 | Next.js 图片域名白名单 | 代码 | 否（OSS 图片需要） |
| T5 | `next.config.js` output standalone | 代码 | 建议（Docker 优化） |

---

## 4. 内容需求

### 4.1 隐私政策 `/privacy`

**要求**

- 必须包含真实的法律文本，不能是占位符
- 需要覆盖以下核心条款（App Store 和国内监管均要求）：
  - 收集哪些用户信息（设备信息、账号信息、使用数据等）
  - 信息用途（服务提供、改善产品等）
  - 是否共享给第三方及共享范围
  - 用户权利（访问、删除、撤回同意）
  - 数据保留期限
  - 联系方式
  - 政策更新说明

**实现方案**

当前 `/privacy` 页面为静态页面，只需将占位文本替换为正式法律文本即可，无需改动架构。

提供文本后，直接修改 `apps/site-web/src/app/privacy/page.tsx`。

---

### 4.2 用户协议 `/terms`

**要求**

- 必须包含真实的法律文本，不能是占位符
- 需要覆盖：
  - 服务描述
  - 用户资格（年龄要求等）
  - 用户行为规范
  - 知识产权归属（AI 生成内容的版权声明）
  - 免责条款
  - 服务变更和终止条款
  - 争议解决和适用法律

**实现方案**

同 `/privacy`，修改 `apps/site-web/src/app/terms/page.tsx`。

---

### 4.3 后台基础内容录入

首页和各功能页的所有内容都从后端 API 动态获取，数据库为空时首页关键区块将无内容展示。

上线前必须通过后台 `/admin/site` 录入以下内容：

**站点配置（`/admin/site/config`）**

| 字段 | 说明 | 示例 |
|------|------|------|
| brand_name | 品牌名 | Dreamlog |
| app_name | 产品名 | DreamAI |
| site_title | 网站标题 | DreamAI \| AI Video Generator by Dreamlog |
| hero_title | 首页主标题 | AI 视频创作，为创作者和商家而生 |
| hero_subtitle | 首页副标题 | 文生视频、图生视频、动作控制，一站式 AI 视频生成 |
| primary_cta_text | 主按钮文案 | 在 App Store 下载 |
| primary_cta_link | 主按钮链接 | App Store 链接 |
| contact_email | 联系邮箱 | support@dreamlog.com |
| footer_text | 页脚文案 | © 2026 Dreamlog. All rights reserved. |
| seo_title | SEO 标题 | DreamAI \| AI 视频生成工具 |
| seo_description | SEO 描述 | 使用 DreamAI，从文字、图片一键生成创意视频 |

**功能模块（`/admin/site/features`）**

至少录入 3–5 个功能，并设置 `is_published = true`：

- 文生视频
- 图生视频
- 首尾帧视频
- 动作控制
- 带货视频生成

**FAQ（`/admin/site/faqs`）**

至少录入 4–6 条常见问题，并设置 `is_published = true`。

**下载链接（`/admin/site/download-links`）**

至少录入 App Store 链接，并设置 `is_enabled = true`：

- platform: `ios`
- title: `Download on the App Store`
- url: App Store 链接

---

## 5. 技术需求

### 5.1 Dockerfile

使用 Next.js standalone 模式，减小镜像体积。

`apps/site-web/next.config.js` 需增加：

```js
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
}
```

Dockerfile 放在 `apps/site-web/Dockerfile`，采用多阶段构建：

- 阶段 1：`node:20-alpine` 安装依赖并构建
- 阶段 2：仅复制 `.next/standalone` 和静态资源，最小化运行时镜像

---

### 5.2 Nginx 配置

Nginx 作为反向代理，将 `dreamlog.com` 的流量转发到 Next.js 服务。

核心配置要点：

- HTTP → HTTPS 重定向
- 反向代理到 Next.js（默认端口 3000）
- 静态资源 `/_next/static/` 直接由 Nginx 提供（可选，standalone 模式已内置）
- 配置 SSL 证书（Let's Encrypt 或云厂商证书）
- 设置合理的 `proxy_read_timeout` 和 `proxy_connect_timeout`（SSR 页面可能较慢）

---

### 5.3 生产环境变量

在服务器上需要设置以下环境变量：

```env
NEXT_PUBLIC_SITE_API_BASE_URL=https://api.dreamlog.com/api/v1
NODE_ENV=production
```

注意：
- `NEXT_PUBLIC_` 前缀变量在构建时打包进前端代码，必须在 `docker build` 时传入，不能只在运行时设置
- 后端 API 地址需使用生产环境的真实地址

---

### 5.4 Next.js 图片域名白名单

如果后台上传的图片存储在 OSS（如阿里云 OSS），需要在 `next.config.js` 中配置允许的图片域名，否则 Next.js `<Image>` 组件会报错（当前项目用 `<img>` 标签，实际影响取决于代码路径）。

```js
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-bucket.oss-cn-hangzhou.aliyuncs.com",
      },
    ],
  },
}
```

---

## 6. 备案相关说明

### 6.1 ICP 备案要求（国内服务器）

若网站部署在国内云服务器，域名访问前必须完成 ICP 备案。备案材料通常需要：

- 网站域名
- 网站名称
- 主办单位信息（公司或个人）
- 网站服务内容描述
- 网站负责人信息

网站上线前需要准备好隐私政策和用户协议，备案审核时可能要求页面可访问。

### 6.2 App Store 隐私政策 URL 要求

App Store 应用在提交审核时需要填写隐私政策 URL，该 URL 必须：

- 可以公开访问（无需登录）
- 内容与 App 实际数据收集行为一致
- 页面稳定，不能是临时链接

推荐 URL：`https://dreamlog.com/privacy`

### 6.3 其他平台备案参考

| 场景 | 要求 |
|------|------|
| App Store 上架 | 提供隐私政策 URL |
| Google Play 上架 | 提供隐私政策 URL |
| 国内 ICP 备案 | 网站需已部署且可访问 |
| 微信小程序 / 企业号 | 需要隐私政策和服务条款 |

---

## 7. 上线检查清单

上线前依次确认以下所有项目：

### 内容检查

- [ ] `/privacy` 页面包含正式隐私政策文本（非占位符）
- [ ] `/terms` 页面包含正式用户协议文本（非占位符）
- [ ] 后台已录入站点配置（brand_name、hero_title、CTA 等）
- [ ] 后台已录入至少 3 个已发布功能模块
- [ ] 后台已录入至少 4 条已发布 FAQ
- [ ] 后台已录入 App Store 下载链接（is_enabled = true）

### 技术检查

- [ ] `next.config.js` 已配置 `output: "standalone"`
- [ ] Dockerfile 构建成功（本地验证）
- [ ] 生产环境变量 `NEXT_PUBLIC_SITE_API_BASE_URL` 已配置
- [ ] 后端 API 服务在云服务器上已启动并可访问
- [ ] Nginx 反向代理配置正确，可转发到 Next.js
- [ ] SSL 证书已配置，HTTPS 访问正常
- [ ] 域名 DNS 解析已指向云服务器

### 访问验证

- [ ] `https://dreamlog.com/` 首页正常显示，关键内容不为空
- [ ] `https://dreamlog.com/privacy` 显示完整隐私政策
- [ ] `https://dreamlog.com/terms` 显示完整用户协议
- [ ] `https://dreamlog.com/features` 显示功能列表
- [ ] `https://dreamlog.com/faq` 显示 FAQ 列表
- [ ] `https://dreamlog.com/download` 显示下载按钮且链接有效
- [ ] 所有页面在移动端布局正常

---

## 8. 不在本次上线范围内

以下内容已记录，留待后续迭代，不阻塞 V1 上线：

- 关于页品牌内容替换（当前为英文技术说明，功能正常）
- 博客文章内容（当前无文章但页面正常展示）
- 联系页表单实际发送能力（页面已有，表单提交功能待接入）
- Admin Console 模板管理、工具管理、Banner 管理等占位模块
- SEO 深度优化（sitemap、robots.txt、OG 标签）
- 移动端 PWA 支持
- 性能优化（图片懒加载、字体优化等）
