# Dream AI 官网后台管理系统前端需求文档

## 1. 文档目的

本文档用于明确当前官网项目 `apps/site-web` 的后台管理系统前端需求边界，作为后续 UI 设计、页面开发、联调验收的统一依据。

本次需求分析基于以下事实：

- 当前官网项目为 `Next.js 14 + React 18 + TypeScript + TailwindCSS`
- 服务端只读参考位于 `server-readonly/dream-ai`
- 本次前端后台开发以 `internal/router/router.go` 中 `adminGroup` 已存在的站点管理接口为主
- `server-readonly` 仅作 API 和业务参考，不允许修改其中实现

---

## 2. 项目目标

在现有官网项目中实现一个可供管理员使用的后台管理系统，用于维护官网内容数据，并与前台站点展示联动。

后台一期目标：

- 支持管理员进入后台内容管理页
- 支持查看并编辑站点基础配置
- 支持管理功能模块、FAQ、文章、下载链接
- 支持内容状态控制与排序
- 与当前 Go 后端 `/api/v1/admin/site/*` 接口完成联调

后台一期不包含：

- 复杂 RBAC 权限系统
- 文件上传中心
- 数据统计分析看板
- 删除回收站
- 审批流
- 多管理员协同编辑冲突处理

---

## 3. 当前前端架构现状

当前官网项目关键结构如下：

```text
apps/site-web/
  src/app/                    # App Router 页面
  src/components/layout/      # 官网公共壳层
  src/components/sections/    # 官网各业务区块
  src/components/admin/       # 后台组件（目前仅一个面板）
  src/lib/api/site.ts         # 前台内容 API
  src/lib/api/site-admin.ts   # 后台内容 API
  src/types/site.ts           # 站点内容类型
```

当前后台已有初版实现：

- 路由入口：`/admin/site`
- 页面文件：`src/app/admin/site/page.tsx`
- 主面板：`src/components/admin/site-admin-panel.tsx`

现状判断：

- 已经具备基础 CRUD 面板，不是空白页
- 当前为单页面、单组件堆叠式实现
- 缺少后台专属 layout、导航、页面层拆分
- 缺少更明确的表单分层、状态管理分层、交互规范

因此后续开发建议在“现有代码基础上重构增强”，而不是推翻重写。

---

## 4. 服务端已确认可用的后台接口范围

根据 `server-readonly/dream-ai/internal/router/router.go`、`internal/handler/admin/site.go`、`internal/service/site_admin.go`、`internal/model/dto/site.go` 分析，当前已实现的后台站点接口如下：

### 4.1 站点配置

- `GET /api/v1/admin/site/config`
- `PUT /api/v1/admin/site/config`

### 4.2 功能模块 Features

- `GET /api/v1/admin/site/features`
- `POST /api/v1/admin/site/features`
- `PUT /api/v1/admin/site/features/:id`

### 4.3 FAQ

- `GET /api/v1/admin/site/faqs`
- `POST /api/v1/admin/site/faqs`
- `PUT /api/v1/admin/site/faqs/:id`

### 4.4 文章 Posts

- `GET /api/v1/admin/site/posts`
- `POST /api/v1/admin/site/posts`
- `PUT /api/v1/admin/site/posts/:id`

支持查询参数：

- `page`
- `page_size`
- `status`

### 4.5 下载链接 Download Links

- `GET /api/v1/admin/site/download-links`
- `POST /api/v1/admin/site/download-links`
- `PUT /api/v1/admin/site/download-links/:id`

### 4.6 权限要求

所有 `/api/v1/admin/*` 接口均在：

- `ValidateAuth`
- `RequireAdmin`

之后才能访问。

这意味着后台页面前提是“已拿到管理员身份 token”。

---

## 5. 服务端业务规则分析

## 5.1 通用响应特征

前后端当前约定的响应包结构为：

- `code`
- `msg`
- `data`

当前前端 `src/lib/api/site-admin.ts` 已按该结构封装。

## 5.2 站点配置规则

配置保存接口为“upsert”模式：

- 查不到配置时后端会自动创建
- 查到配置时做更新

必填字段：

- `brand_name`
- `app_name`
- `site_title`
- `hero_title`

可选字段：

- `site_subtitle`
- `hero_subtitle`
- `primary_cta_text`
- `primary_cta_link`
- `secondary_cta_text`
- `secondary_cta_link`
- `contact_email`
- `footer_text`
- `seo_title`
- `seo_description`
- `logo_url`
- `favicon_url`

前台联动点：

- 全局标题和描述
- Header 品牌名与主 CTA
- Footer 文案
- Contact 页邮箱

## 5.3 功能模块规则

字段结构：

- `key` 必填，且数据库唯一
- `title` 必填
- `subtitle`
- `description`
- `detail_content`
- `cover_image_url`
- `icon_url`
- `tags`
- `sort`
- `is_published`

业务规则：

- 前台只展示 `is_published = true` 的数据
- 后台列表返回全部数据
- 排序按 `sort asc, id asc`

前端注意：

- `key` 应视为稳定标识，不建议随意修改
- `tags` 目前后端存储为 `jsonb`
- 创建时若未传 `sort/is_published`，后端会给默认值

## 5.4 FAQ 规则

字段结构：

- `question` 必填
- `answer` 必填
- `sort`
- `is_published`

业务规则：

- 前台只展示已发布 FAQ
- 后台列表返回全部 FAQ
- 排序同样按 `sort asc, id asc`

## 5.5 文章规则

字段结构：

- `title` 必填
- `slug` 必填，且数据库唯一
- `summary`
- `content_markdown`
- `cover_image_url`
- `status`
- `seo_title`
- `seo_description`
- `published_at`

文章状态仅支持：

- `draft`
- `published`
- `offline`

重要业务规则：

- 若 `status` 为空，后端默认按 `draft`
- 若 `status = published` 且未传 `published_at`，后端会自动补当前时间
- 前台文章列表与详情页只展示：
  - `status = published`
  - `published_at` 不为空
  - `published_at <= now`
- 后台文章列表支持按 `status` 过滤
- 后台列表按 `published_at desc nulls last, id desc`

前端注意：

- 后台需要清楚区分“草稿 / 已发布 / 已下线”
- `published_at` 建议提供更友好的时间输入与说明，避免直接要求管理员填写 Unix 时间戳
- slug 应提供格式规范提示，避免重复和空格问题

## 5.6 下载链接规则

字段结构：

- `platform` 必填
- `title` 必填
- `url` 必填
- `is_enabled`
- `sort`

业务规则：

- 前台只展示 `is_enabled = true`
- 后台列表返回全部
- 排序按 `sort asc, id asc`

前端注意：

- `platform` 当前后端没有枚举限制，前端可先提供推荐值
- `url` 需要做基础格式校验

---

## 6. 已确认存在的后端能力缺口

以下能力在当前 `admin/site` 接口中尚未实现，前端不能假设可用：

### 6.1 删除接口缺失

以下资源目前都没有删除接口：

- config
- feature
- faq
- post
- download-link

影响：

- 后台一期不能提供真正的删除能力
- 前端只能提供“下线 / 禁用 / 改状态 / 清空内容”等替代操作

建议：

- 若业务必须删除，需要后端补 `DELETE` 接口

### 6.2 媒体上传能力缺失

以下字段都只有 URL，没有上传接口：

- `logo_url`
- `favicon_url`
- `cover_image_url`
- `icon_url`

影响：

- 后台一期只能手动粘贴图片 URL
- 无法直接上传封面、图标、Logo

建议：

- 若要提升后台可用性，需要后端补充上传接口或复用现有 OSS/ST S 能力配合前端直传

### 6.3 后台登录流程未纳入站点后台范围

当前项目内虽然存在 `/api/v1/auth/login/password` 等接口，但站点后台自身没有独立的登录页和 session 方案。

当前前端现实约束：

- 只能手动粘贴 Bearer Token

建议：

- 如果希望后台正式可用，需要明确管理员登录流程
- 最少应补一个后台登录页，接入已有 auth API
- 更理想方案是改为 cookie/session 或更明确的 token 保存策略

### 6.4 缺少资源详情接口

当前站点后台资源编辑依赖列表接口返回的全量字段，未提供单条详情接口：

- feature detail
- faq detail
- post detail by id
- download-link detail by id

影响：

- 当前前端可以做列表内编辑
- 若后续要做独立详情页编辑，需要前端自行从列表中命中或请求新的后端详情接口

### 6.5 缺少唯一性友好校验接口

例如：

- `feature.key` 唯一
- `post.slug` 唯一

当前后端大概率会在 DB 层报错，但没有单独的“校验可用性”接口。

影响：

- 前端只能在提交失败后再展示错误

---

## 7. 后台前端产品需求

## 7.1 信息架构

建议后台一期采用以下结构：

- `/admin/login` 管理员登录页或 token 进入页
- `/admin` 后台首页，默认跳转到站点管理
- `/admin/site` 站点管理总览
- `/admin/site/config` 站点配置
- `/admin/site/features` 功能模块管理
- `/admin/site/faqs` FAQ 管理
- `/admin/site/posts` 文章管理
- `/admin/site/download-links` 下载链接管理

若开发节奏更快，也可一期先做单路由：

- `/admin/site`

但 UI 上至少要具备：

- 左侧导航或顶部标签导航
- 模块切换
- 明确的保存反馈

## 7.2 后台布局需求

建议后台与官网 `SiteShell` 分离，单独提供 Admin Layout。

后台 layout 需包含：

- Sidebar 或顶部管理导航
- 页面标题区
- 管理员身份区
- 全局消息区
- 内容滚动区

不建议继续复用官网 Header / Footer。

## 7.3 公共交互需求

后台所有模块需统一具备：

- 页面初始加载态
- 请求提交 loading 态
- 成功提示
- 错误提示
- 空数据态
- 未授权态
- token 失效提示

建议统一错误文案策略：

- 401/403：提示重新登录或重新填写 token
- 400：展示后端返回字段错误
- 500：展示系统异常与重试入口

## 7.4 表单能力需求

后台表单建议统一支持：

- 必填项标识
- 提交前前端基础校验
- 保存按钮禁用态
- 保存成功后保留当前输入
- 未保存修改提醒

建议抽公共组件：

- `AdminPage`
- `AdminSection`
- `AdminCard`
- `AdminField`
- `AdminTextarea`
- `AdminSwitch`
- `AdminSelect`
- `AdminStatusBadge`
- `AdminEmptyState`

---

## 8. 各模块详细前端需求

## 8.1 站点配置模块

页面目标：

- 维护品牌与官网全局内容

表单字段：

- Brand Name
- App Name
- Site Title
- Site Subtitle
- Hero Title
- Hero Subtitle
- Primary CTA Text
- Primary CTA Link
- Secondary CTA Text
- Secondary CTA Link
- Contact Email
- Footer Text
- SEO Title
- SEO Description
- Logo URL
- Favicon URL

前端需求：

- 页面加载时自动请求配置
- 支持单页保存
- 可增加“前台影响预览说明”
- URL 字段应做基础合法性校验
- Email 字段应做邮箱格式校验

## 8.2 功能模块管理

页面目标：

- 管理官网功能卡片和展示顺序

列表字段建议展示：

- Title
- Key
- Tags
- Sort
- Published 状态

操作需求：

- 列表查看
- 新增功能
- 编辑功能
- 发布/取消发布
- 调整排序

交互建议：

- 提供“列表模式 + 抽屉/弹窗编辑”或“列表 + 内联编辑”
- `key` 字段保存前应做格式提示
- `tags` 支持逗号分隔录入

## 8.3 FAQ 管理

页面目标：

- 管理 FAQ 问答与顺序

列表字段建议展示：

- Question
- Sort
- Published 状态

操作需求：

- 新增
- 编辑
- 发布/取消发布
- 排序调整

交互建议：

- FAQ 适合轻量列表编辑
- Answer 支持多行文本输入

## 8.4 文章管理

页面目标：

- 管理博客 / 更新日志内容

列表字段建议展示：

- Title
- Slug
- Status
- Published At
- Updated At

筛选需求：

- 按状态筛选：`all / draft / published / offline`

操作需求：

- 新增文章
- 编辑文章
- 切换状态
- 设置发布时间

关键交互：

- `content_markdown` 使用多行编辑器
- `published_at` 建议采用本地时间选择器，提交前转换为 Unix 秒级时间戳
- 提供 slug 自动生成建议
- 在状态切为 `published` 时，若未选择发布时间，应提示会默认使用当前时间

可选增强：

- 文章预览
- Markdown 预览

## 8.5 下载链接管理

页面目标：

- 管理 App Store 和其他平台下载入口

列表字段建议展示：

- Platform
- Title
- URL
- Enabled 状态
- Sort

操作需求：

- 新增
- 编辑
- 启用/禁用
- 排序调整

交互建议：

- 提供平台推荐值，如 `ios`、`android`、`web`
- URL 做必填和格式校验

---

## 9. 后台认证与安全需求

一期若沿用当前项目方案，可采用：

- 手动填写 Bearer Token
- 存在 `localStorage`

但从正式产品角度，建议最少改造为：

- 独立后台登录页
- 登录成功后保存管理员 token
- 支持退出登录
- token 失效自动跳转登录

安全注意事项：

- 不在页面上明文长时间展示 token
- 失败时不要把完整 token 打进日志

---

## 10. 前端技术实现建议

## 10.1 目录建议

建议在现有 `apps/site-web` 中新增如下结构：

```text
src/
  app/
    admin/
      layout.tsx
      page.tsx
      login/page.tsx
      site/
        page.tsx
        config/page.tsx
        features/page.tsx
        faqs/page.tsx
        posts/page.tsx
        download-links/page.tsx
  components/
    admin/
      layout/
      common/
      forms/
      modules/
  lib/
    api/
      site-admin.ts
    admin/
      auth.ts
      format.ts
      validators.ts
```

## 10.2 状态管理建议

当前规模下可以继续采用：

- React `useState`
- `useEffect`
- `useTransition`

但建议至少拆分为：

- token 状态
- 数据查询状态
- 编辑表单状态
- 全局反馈状态

如果页面继续扩展，可考虑引入：

- React Query / TanStack Query

但一期不是强制要求。

## 10.3 组件抽象建议

建议先做后台专用的基础组件层，而不是继续在一个页面文件里内联定义：

- 按钮
- 表单输入
- 文本域
- 开关
- 状态徽章
- 页面区块
- 列表卡片
- 筛选条

---

## 11. 联调与验收标准

## 11.1 联调通过标准

以下场景需全部跑通：

- 能使用管理员 token 拉取后台站点配置
- 能修改并保存站点配置
- 能新增、编辑功能模块
- 能新增、编辑 FAQ
- 能新增、编辑文章，并通过状态控制影响前台展示
- 能新增、编辑下载链接，并通过启用状态影响前台展示

## 11.2 前台联动验收

保存后台内容后，前台需验证：

- Header / Footer / Hero 文案同步变化
- 仅已发布 feature 在前台显示
- 仅已发布 FAQ 在前台显示
- 仅符合发布时间条件的文章在前台显示
- 仅启用的下载链接在前台显示

## 11.3 UI 验收

- 后台不再复用官网壳层
- 后台导航清晰
- 表单布局稳定
- 提交反馈明确
- 移动端至少可访问和可操作

---

## 12. 需要后端补充后再开发的事项

以下事项如进入本期范围，需要先由后端补接口，再继续前端实现：

- 删除任意站点资源
- 图片/文件上传
- 后台独立登录态方案
- 单资源详情接口
- slug / key 唯一性预校验接口

---

## 13. 本期前端结论

基于当前服务端实现，后台管理系统前端 V1 可以直接启动开发，且无需等待后端新增接口即可完成以下核心能力：

- 站点配置管理
- 功能模块管理
- FAQ 管理
- 文章管理
- 下载链接管理

但需明确按当前后端边界开发：

- 只有新增、查询、更新，没有删除
- 只有 URL 输入，没有上传
- 只有 Bearer Token 接入，没有正式后台登录态

因此推荐本期实施策略：

1. 先完成后台专属 layout 和导航骨架
2. 再将现有 `site-admin-panel` 拆分为模块化页面
3. 最后补齐状态筛选、时间选择、表单校验与交互反馈

