"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminField, AdminSectionCard, AdminToggle } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  createAdminSiteDownloadLink,
  deleteAdminSiteDownloadLink,
  getAdminSiteDownloadLinks,
  type SiteDownloadLinkPayload,
  updateAdminSiteDownloadLink,
} from "@/lib/api/site-admin"
import type { SiteDownloadLink } from "@/types/site"

const emptyLink: SiteDownloadLinkPayload = {
  platform: "ios",
  title: "",
  url: "",
  is_enabled: false,
  sort: 0,
}

export function SiteDownloadLinksAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [links, setLinks] = useState<SiteDownloadLink[]>([])
  const [newLink, setNewLink] = useState<SiteDownloadLinkPayload>(emptyLink)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadLinks() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载下载链接…")
        const items = await getAdminSiteDownloadLinks(authToken)
        setLinks(items)
        updateFeedback(`已加载 ${items.length} 条下载链接。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function createLink() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在创建下载链接…")
        const saved = await createAdminSiteDownloadLink(authToken, newLink)
        setLinks((current) => [...current, saved].sort((a, b) => a.sort - b.sort))
        setNewLink(emptyLink)
        updateFeedback("下载链接已创建。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  function saveLink(item: SiteDownloadLink) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在保存下载链接…")
        const saved = await updateAdminSiteDownloadLink(authToken, item.id, {
          platform: item.platform,
          title: item.title,
          url: item.url,
          is_enabled: item.is_enabled,
          sort: item.sort,
        })
        setLinks((current) => current.map((link) => (link.id === saved.id ? saved : link)).sort((a, b) => a.sort - b.sort))
        updateFeedback("下载链接已保存。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  function removeLink(item: SiteDownloadLink) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "当前管理员会话不存在，请先登录后台。")
      return
    }
    if (!window.confirm(`确认删除下载链接「${item.title}」吗？`)) {
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在删除下载链接…")
        await deleteAdminSiteDownloadLink(authToken, item.id)
        setLinks((current) => current.filter((link) => link.id !== item.id))
        updateFeedback("下载链接已删除。")
      } catch (removeError) {
        updateFeedback("", removeError instanceof Error ? removeError.message : "删除失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadLinks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Download links</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Manage enabled platform entry points for the public download surface and keep future expansion routes ready.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadLinks}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Create Download Link"
        description="Add a new platform entry point for the public download page."
        action={
          <button type="button" onClick={createLink} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "新增链接"}
          </button>
        }
      >
        <DownloadLinkForm link={newLink} onChange={setNewLink} />
      </AdminSectionCard>

      <div className="grid gap-4">
        {links.map((link) => (
          <AdminSectionCard
            key={link.id}
            title={link.title}
            description={`Platform: ${link.platform}`}
            action={
              <div className="flex items-center gap-3">
                <AdminStatusBadge label={link.is_enabled ? "Enabled" : "Disabled"} tone={link.is_enabled ? "green" : "rose"} />
                <button
                  type="button"
                  onClick={() => removeLink(link)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                >
                  删除
                </button>
                <button
                  type="button"
                  onClick={() => saveLink(link)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  保存改动
                </button>
              </div>
            }
          >
            <DownloadLinkForm
              link={link}
              onChange={(nextLink) => setLinks((current) => current.map((item) => (item.id === link.id ? { ...item, ...nextLink } : item)))}
            />
          </AdminSectionCard>
        ))}
      </div>
    </div>
  )
}

function DownloadLinkForm({
  link,
  onChange,
}: {
  link: SiteDownloadLinkPayload
  onChange: (link: SiteDownloadLinkPayload) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminField label="Platform" value={link.platform || ""} onChange={(value) => onChange({ ...link, platform: value })} />
      <AdminField label="Title" value={link.title || ""} onChange={(value) => onChange({ ...link, title: value })} />
      <AdminField label="URL" value={link.url || ""} onChange={(value) => onChange({ ...link, url: value })} />
      <AdminField label="Sort" value={String(link.sort ?? 0)} onChange={(value) => onChange({ ...link, sort: toNumber(value) })} />
      <AdminToggle label="Enabled" checked={Boolean(link.is_enabled)} onChange={(value) => onChange({ ...link, is_enabled: value })} />
    </div>
  )
}

function toNumber(value: string) {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : 0
}
