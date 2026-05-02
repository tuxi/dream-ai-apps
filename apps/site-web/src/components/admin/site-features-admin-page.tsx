"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field"
import { AdminField, AdminSectionCard, AdminTextarea, AdminToggle } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  createAdminSiteFeature,
  deleteAdminSiteFeature,
  getAdminSiteFeatures,
  type SiteFeaturePayload,
  updateAdminSiteFeature,
} from "@/lib/api/site-admin"
import type { SiteFeature } from "@/types/site"

const emptyFeature: SiteFeaturePayload = {
  key: "",
  title: "",
  subtitle: "",
  description: "",
  detail_content: "",
  cover_image_url: "",
  icon_url: "",
  tags: [],
  sort: 0,
  is_published: false,
}

export function SiteFeaturesAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [features, setFeatures] = useState<SiteFeature[]>([])
  const [newFeature, setNewFeature] = useState<SiteFeaturePayload>(emptyFeature)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadFeatures() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载功能模块…")
        const items = await getAdminSiteFeatures(authToken)
        setFeatures(items)
        updateFeedback(`已加载 ${items.length} 个功能模块。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function createFeature() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在创建功能模块…")
        const saved = await createAdminSiteFeature(authToken, newFeature)
        setFeatures((current) => [...current, saved].sort((a, b) => a.sort - b.sort))
        setNewFeature(emptyFeature)
        updateFeedback("功能模块已创建。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  function saveFeature(item: SiteFeature) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback(`正在保存 ${item.title}…`)
        const saved = await updateAdminSiteFeature(authToken, item.id, {
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          detail_content: item.detail_content,
          cover_image_url: item.cover_image_url,
          icon_url: item.icon_url,
          tags: item.tags || [],
          sort: item.sort,
          is_published: item.is_published,
        })
        setFeatures((current) => current.map((feature) => (feature.id === saved.id ? saved : feature)).sort((a, b) => a.sort - b.sort))
        updateFeedback(`功能 ${saved.title} 已保存。`)
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  function removeFeature(item: SiteFeature) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "当前管理员会话不存在，请先登录后台。")
      return
    }
    if (!window.confirm(`确认删除功能模块「${item.title}」吗？`)) {
      return
    }

    startTransition(async () => {
      try {
        updateFeedback(`正在删除 ${item.title}…`)
        await deleteAdminSiteFeature(authToken, item.id)
        setFeatures((current) => current.filter((feature) => feature.id !== item.id))
        updateFeedback(`功能模块 ${item.title} 已删除。`)
      } catch (removeError) {
        updateFeedback("", removeError instanceof Error ? removeError.message : "删除失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadFeatures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(240,253,250,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Feature modules</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Manage the feature cards that describe DreamAI capabilities on the public website, including publish state, ordering, and descriptive content.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadFeatures}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Create Feature"
        description="Create a new feature card for the public site."
        action={
          <button type="button" onClick={createFeature} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "新增功能"}
          </button>
        }
      >
        <FeatureForm feature={newFeature} token={token} onChange={setNewFeature} />
      </AdminSectionCard>

      <div className="grid gap-4">
        {features.map((feature) => (
          <AdminSectionCard
            key={feature.id}
            title={feature.title}
            description={`Feature key: ${feature.key}`}
            action={
              <div className="flex items-center gap-3">
                <AdminStatusBadge label={feature.is_published ? "Published" : "Draft"} tone={feature.is_published ? "green" : "amber"} />
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                >
                  删除
                </button>
                <button
                  type="button"
                  onClick={() => saveFeature(feature)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  保存改动
                </button>
              </div>
            }
          >
            <FeatureForm
              feature={feature}
              token={token}
              onChange={(nextFeature) =>
                setFeatures((current) => current.map((item) => (item.id === feature.id ? { ...item, ...nextFeature } : item)))
              }
            />
          </AdminSectionCard>
        ))}
      </div>
    </div>
  )
}

function FeatureForm({
  feature,
  token,
  onChange,
}: {
  feature: SiteFeaturePayload
  token: string
  onChange: (feature: SiteFeaturePayload) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminField label="Key" value={feature.key || ""} onChange={(value) => onChange({ ...feature, key: value })} />
      <AdminField label="Title" value={feature.title || ""} onChange={(value) => onChange({ ...feature, title: value })} />
      <AdminField label="Subtitle" value={feature.subtitle || ""} onChange={(value) => onChange({ ...feature, subtitle: value })} />
      <AdminField label="Sort" value={String(feature.sort ?? 0)} onChange={(value) => onChange({ ...feature, sort: toNumber(value) })} />
      <AdminField label="Tags" value={(feature.tags || []).join(", ")} onChange={(value) => onChange({ ...feature, tags: splitTags(value) })} />
      <AdminField label="Icon URL" value={feature.icon_url || ""} onChange={(value) => onChange({ ...feature, icon_url: value })} />
      <AdminField label="Cover URL" value={feature.cover_image_url || ""} onChange={(value) => onChange({ ...feature, cover_image_url: value })} />
      <AdminImageUploadField label="Upload Icon" value={feature.icon_url || ""} token={token} onChange={(value) => onChange({ ...feature, icon_url: value })} />
      <AdminImageUploadField label="Upload Cover" value={feature.cover_image_url || ""} token={token} onChange={(value) => onChange({ ...feature, cover_image_url: value })} />
      <AdminToggle label="Published" checked={Boolean(feature.is_published)} onChange={(value) => onChange({ ...feature, is_published: value })} />
      <AdminTextarea label="Description" value={feature.description || ""} onChange={(value) => onChange({ ...feature, description: value })} />
      <AdminTextarea label="Detail Content" value={feature.detail_content || ""} onChange={(value) => onChange({ ...feature, detail_content: value })} />
    </div>
  )
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function toNumber(value: string) {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : 0
}
