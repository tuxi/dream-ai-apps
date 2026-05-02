"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field"
import { AdminField, AdminSectionCard, AdminTextarea } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { getAdminSiteConfig, type SiteConfigPayload, updateAdminSiteConfig } from "@/lib/api/site-admin"

const emptyConfig: SiteConfigPayload = {
  brand_name: "",
  app_name: "",
  site_title: "",
  site_subtitle: "",
  hero_title: "",
  hero_subtitle: "",
  primary_cta_text: "",
  primary_cta_link: "",
  secondary_cta_text: "",
  secondary_cta_link: "",
  contact_email: "",
  footer_text: "",
  seo_title: "",
  seo_description: "",
  logo_url: "",
  favicon_url: "",
}

export function SiteConfigAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [form, setForm] = useState<SiteConfigPayload>(emptyConfig)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadConfig() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载站点配置…")
        const config = await getAdminSiteConfig(authToken)
        setForm(config)
        updateFeedback("站点配置已加载。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function saveConfig() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在保存站点配置…")
        const saved = await updateAdminSiteConfig(authToken, form)
        setForm(saved)
        updateFeedback("站点配置已保存。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Site configuration</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Manage brand identity, hero copy, CTA links, SEO metadata, and global website contact and footer settings.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadConfig}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Config Form"
        description="These fields map directly to `/api/v1/admin/site/config` and drive the public website shell and metadata."
        action={
          <button type="button" onClick={saveConfig} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "保存配置"}
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Brand Name" value={form.brand_name || ""} onChange={(value) => setForm((current) => ({ ...current, brand_name: value }))} />
          <AdminField label="App Name" value={form.app_name || ""} onChange={(value) => setForm((current) => ({ ...current, app_name: value }))} />
          <AdminField label="Site Title" value={form.site_title || ""} onChange={(value) => setForm((current) => ({ ...current, site_title: value }))} />
          <AdminField label="Hero Title" value={form.hero_title || ""} onChange={(value) => setForm((current) => ({ ...current, hero_title: value }))} />
          <AdminField label="Primary CTA Text" value={form.primary_cta_text || ""} onChange={(value) => setForm((current) => ({ ...current, primary_cta_text: value }))} />
          <AdminField label="Primary CTA Link" value={form.primary_cta_link || ""} onChange={(value) => setForm((current) => ({ ...current, primary_cta_link: value }))} />
          <AdminField label="Secondary CTA Text" value={form.secondary_cta_text || ""} onChange={(value) => setForm((current) => ({ ...current, secondary_cta_text: value }))} />
          <AdminField label="Secondary CTA Link" value={form.secondary_cta_link || ""} onChange={(value) => setForm((current) => ({ ...current, secondary_cta_link: value }))} />
          <AdminField label="Contact Email" value={form.contact_email || ""} onChange={(value) => setForm((current) => ({ ...current, contact_email: value }))} />
          <AdminField label="SEO Title" value={form.seo_title || ""} onChange={(value) => setForm((current) => ({ ...current, seo_title: value }))} />
          <AdminField label="Logo URL" value={form.logo_url || ""} onChange={(value) => setForm((current) => ({ ...current, logo_url: value }))} />
          <AdminField label="Favicon URL" value={form.favicon_url || ""} onChange={(value) => setForm((current) => ({ ...current, favicon_url: value }))} />
          <AdminImageUploadField label="Upload Logo" value={form.logo_url || ""} token={token} onChange={(value) => setForm((current) => ({ ...current, logo_url: value }))} />
          <AdminImageUploadField label="Upload Favicon" value={form.favicon_url || ""} token={token} onChange={(value) => setForm((current) => ({ ...current, favicon_url: value }))} />
          <AdminTextarea label="Site Subtitle" value={form.site_subtitle || ""} onChange={(value) => setForm((current) => ({ ...current, site_subtitle: value }))} />
          <AdminTextarea label="Hero Subtitle" value={form.hero_subtitle || ""} onChange={(value) => setForm((current) => ({ ...current, hero_subtitle: value }))} />
          <AdminTextarea label="SEO Description" value={form.seo_description || ""} onChange={(value) => setForm((current) => ({ ...current, seo_description: value }))} />
          <AdminTextarea label="Footer Text" value={form.footer_text || ""} onChange={(value) => setForm((current) => ({ ...current, footer_text: value }))} />
        </div>
      </AdminSectionCard>
    </div>
  )
}
