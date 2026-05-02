# Dream AI Apps

这是 Dream AI 官网前端工作区，当前主要承载 `DreamAI` 官网 Web 项目，以及与后台管理系统开发相关的前端文档与只读服务端参考。

## 仓库结构

```text
dream-ai-apps/
  apps/
    site-web/          # 官网前端，Next.js App Router
  docs/                # 项目文档与需求文档
  server-readonly/     # 只读服务端备份，用于接口和业务参考
  README.md
  .gitignore
```


## 当前前端项目

官网前端位于 [apps/site-web](/Users/xiaoyuan/Documents/work/git/dream-ai-apps/apps/site-web)，技术栈如下：

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

当前官网已包含：

- 官网公开页面
- 基于内容 API 的前台渲染
- 初版 `/admin/site` 后台面板

## server-readonly 说明

[server-readonly](/Users/xiaoyuan/Documents/work/git/dream-ai-apps/server-readonly) 是服务端代码备份，仅用于：

- 查看接口定义
- 理解 handler / service / repository 业务边界
- 分析前端可开发范围

重要约束：

- `server-readonly` 已加入 `.gitignore`
- 不允许修改 `server-readonly` 中的任何实现
- 如果前端需求依赖服务端未实现的接口或业务，需要先同步给后端补齐后再继续开发

本次后台管理系统需求分析主要参考：

- `server-readonly/dream-ai/internal/router/router.go`
- `server-readonly/dream-ai/internal/handler/admin/site.go`
- `server-readonly/dream-ai/internal/service/site_admin.go`
- `server-readonly/dream-ai/internal/model/dto/site.go`

## 当前已确认的后台开发范围

基于现有后端实现，前端可以直接开发以下站点后台能力：

- 站点配置管理
- 功能模块管理
- FAQ 管理
- 文章管理
- 下载链接管理

当前后端暂未提供：

- 删除接口
- 媒体上传接口
- 独立后台登录态
- 资源详情接口
- 唯一性预校验接口

如这些能力进入开发范围，需要先由后端补充。

## 文档入口

本仓库当前推荐优先查看以下文档：

- [官网内容后台前端需求文档](docs/admin-frontend-requirements.md)
- [总后台系统前端需求文档](docs/admin-system-requirements.md)
- [Admin 后端缺口需求清单](docs/admin-backend-gap-requirements.md)

如果后续继续补充架构说明、联调说明、页面设计稿映射，也统一放在 [docs](/Users/xiaoyuan/Documents/work/git/dream-ai-apps/docs) 目录下。

## 开发建议

后台管理系统建议沿当前实现做增量重构，而不是推翻重写：

1. 先拆出后台专属 `layout`
2. 再把现有单文件 admin 面板拆成模块化页面
3. 最后补齐筛选、校验、状态反馈和更完整的交互

## 注意事项

- 当前仓库可能处于持续开发中，提交前请先检查 `git status`
- 不要把 `server-readonly` 当作可编辑代码目录
- 后台功能开发时，以真实后端接口能力为准，不要在前端假设未实现能力存在
