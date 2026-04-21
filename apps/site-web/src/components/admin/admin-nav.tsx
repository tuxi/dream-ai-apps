"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type AdminNavItem = {
  href: string
  label: string
  description?: string
}

type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

const navGroups: AdminNavGroup[] = [
  {
    title: "Workspace",
    items: [
      { href: "/admin/site", label: "Site CMS", description: "官网内容与配置" },
      { href: "/admin/operations", label: "Admin Console", description: "业务后台与运营" },
    ],
  },
  {
    title: "Site CMS",
    items: [
      { href: "/admin/site", label: "Overview", description: "内容后台首页" },
      { href: "/admin/site/config", label: "Config", description: "品牌与站点配置" },
      { href: "/admin/site/features", label: "Features", description: "功能模块" },
      { href: "/admin/site/faqs", label: "FAQs", description: "常见问题" },
      { href: "/admin/site/posts", label: "Posts", description: "博客与更新" },
      { href: "/admin/site/download-links", label: "Download Links", description: "下载入口" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/users", label: "Users", description: "用户与账号" },
      { href: "/admin/billing/orders", label: "Billing", description: "订单、积分与产品" },
      { href: "/admin/templates", label: "Templates", description: "模板运营" },
      { href: "/admin/tools", label: "Tools", description: "工具与模式版本" },
      { href: "/admin/tools/assets", label: "Tool Assets", description: "素材库" },
      { href: "/admin/publish-center", label: "Publish Center", description: "任务发布中心" },
      { href: "/admin/home-banners", label: "Home Banners", description: "首页运营位" },
      { href: "/admin/workflows", label: "Workflows", description: "工作流只读视图" },
    ],
  },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/admin/site" || href === "/admin/tools") {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-full max-w-xs border-r border-white/10 bg-[linear-gradient(180deg,#09111d,#102033)] text-white xl:min-h-screen xl:max-w-sm">
      <div className="sticky top-0 p-6 xl:p-8">
        <Link href="/admin/site" className="block rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">DreamAI Admin</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Unified Backoffice</h1>
          <p className="mt-3 text-sm leading-7 text-white/68">
            Split between content operations for the website and internal tools for product operations.
          </p>
        </Link>

        <nav className="mt-8 space-y-7">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">{group.title}</p>
              <div className="mt-3 grid gap-2">
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-[1.2rem] px-4 py-3 transition ${
                        active
                          ? "bg-white text-ink shadow-lg"
                          : "border border-transparent text-white/78 hover:border-white/10 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <p className="text-sm font-semibold">{item.label}</p>
                      {item.description ? (
                        <p className={`mt-1 text-xs leading-5 ${active ? "text-slate-600" : "text-white/52"}`}>
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
