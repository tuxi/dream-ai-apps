# Dream AI Admin 后端缺口需求清单

## 1. 文档目的

本文档用于统一记录当前后台管理系统前端开发过程中，已经明确需要但后端尚未提供的 `admin` 相关接口或会话能力。

使用原则：

- 只记录已经确认会阻塞后台真实功能落地的缺口
- 不记录纯前端可自行解决的问题
- 不在 `server-readonly` 中做任何修改
- 等当前后台 UI 基本完成后，再集中同步给后端补齐

---

## 2. 已完成项（截至 2026-04-21）

以下能力已经由后端补齐，前端可以直接按真实接口联调：

### 2.1 Admin 独立登录能力

已实现接口：

- `POST /api/v1/admin/login`
- `POST /api/v1/admin/send-login-code`
- `POST /api/v1/admin/login-by-code`
- `POST /api/v1/admin/logout`
- `POST /api/v1/admin/refresh`
- `GET /api/v1/admin/session`

已确认语义：

- 后台登录与普通用户登录分离
- `admin login` 和 `admin login-by-code` 都只允许“已存在且具备管理员角色”的账号登录
- 不允许不存在时自动注册
- `send-login-code` 只会给“已绑定管理员账号的手机号”发送验证码
- `session` 已返回后台初始化所需的身份与权限信息

前端改造建议：

- 不再复用 `/api/v1/auth/login/password` 作为正式后台登录方案
- 管理员登录页可同时支持：
  - `/api/v1/admin/login` 账号密码登录
  - `/api/v1/admin/send-login-code` + `/api/v1/admin/login-by-code` 短信验证码登录
- 后台启动时通过 `/api/v1/admin/session` 初始化登录态
- token 续期统一走 `/api/v1/admin/refresh`

### 2.2 Billing 订单详情接口

已实现接口：

- `GET /api/v1/admin/billing/orders/:id`

当前可用详情字段：

- `id`
- `order_no`
- `user_id`
- `status`
- `product_code`
- `product_type`
- `platform`
- `channel`
- `amount`
- `currency`
- `transaction_id`
- `original_transaction_id`
- `created_at`
- `purchased_at`
- `verified_at`
- `user_snapshot`
- `product_snapshot`
- `verify_message`
- `refund_state`
- `reclaim_state`
- `meta`

### 2.3 Site CMS 删除接口

已实现接口：

- `DELETE /api/v1/admin/site/features/:id`
- `DELETE /api/v1/admin/site/faqs/:id`
- `DELETE /api/v1/admin/site/posts/:id`
- `DELETE /api/v1/admin/site/download-links/:id`

前端改造建议：

- 原先仅支持 `create / update` 的内容面板，现在应补齐删除操作
- 删除操作应统一使用二次确认
- 删除成功后直接刷新列表或本地移除行数据

### 2.4 Site CMS 媒体上传接口

已实现接口：

- `GET /api/v1/admin/media/sts`

当前返回字段：

- `access_key_id`
- `access_key_secret`
- `security_token`
- `expiration`
- `bucket`
- `region`
- `endpoint`
- `host`
- `dir`
- `user_id`

前端改造建议：

- 站点配置、文章封面、下载链接 icon 等资源上传可以直接走后台 STS
- 当前目录前缀由后端统一下发在 `dir` 字段中，前端不应自行硬编码
- 目前是“后台专用 STS 能力”，不是完整媒体中心

---

## 3. 当前仍待补齐的缺口

### 3.1 唯一性与预校验接口

当前现状：

- 多个后台模块存在唯一字段，但前端仍然主要依赖“提交失败后的错误提示”判断是否重复
- 这会导致：
  - 表单体验较差
  - 创建/编辑时需要反复提交
  - 错误提示难以做成稳定交互

典型字段：

- `site/posts.slug`
- `billing/products.product_code`
- `templates.name` 或等价字段
- `tools.route_key`
- `tool_assets.key`

建议后端补齐：

- 按模块提供轻量预校验接口
- 或在现有 create/update 错误响应中统一结构化错误码

## 4. 当前优先级建议

建议后端按以下优先级补齐：

1. `唯一性与预校验接口`
2. `结构化错误码`
3. `媒体上传接口（如需从 STS 升级到完整上传中心）`

---

## 5. 与当前前端实现的关系

当前前端应尽快从“兼容现状”切换到“基于真实后台能力”的模式：

- 管理员登录改为 `/admin/login`
- 短信验证码登录可直接走 `/admin/send-login-code` + `/admin/login-by-code`
- 后台启动时改用 `/admin/session`
- Billing Orders 可接真实详情页
- Site CMS 应补齐 delete 操作
- 站点资源上传可接 `/admin/media/sts`

这意味着：

- 现阶段后台前端可以进入真实联调与交互收口阶段
- 当前真正剩余的后端阻塞点，主要集中在“唯一性预校验”和“错误码规范”
