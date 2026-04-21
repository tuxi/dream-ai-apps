"use client"

import type { ReactNode } from "react"
import { useEffect, useState, useTransition } from "react"

import {
  createAdminSiteDownloadLink,
  createAdminSiteFaq,
  createAdminSiteFeature,
  createAdminSitePost,
  getAdminSiteConfig,
  getAdminSiteDownloadLinks,
  getAdminSiteFaqs,
  getAdminSiteFeatures,
  getAdminSitePosts,
  SiteConfigPayload,
  SiteDownloadLinkPayload,
  SiteFaqPayload,
  SiteFeaturePayload,
  SitePostPayload,
  updateAdminSiteConfig,
  updateAdminSiteDownloadLink,
  updateAdminSiteFaq,
  updateAdminSiteFeature,
  updateAdminSitePost,
} from "@/lib/api/site-admin"
import { SiteConfig, SiteDownloadLink, SiteFaq, SiteFeature, SitePost } from "@/types/site"

type LoadState = {
  config: SiteConfig | null
  features: SiteFeature[]
  faqs: SiteFaq[]
  posts: SitePost[]
  downloadLinks: SiteDownloadLink[]
}

const emptyState: LoadState = {
  config: null,
  features: [],
  faqs: [],
  posts: [],
  downloadLinks: [],
}

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

const emptyFaq: SiteFaqPayload = {
  question: "",
  answer: "",
  sort: 0,
  is_published: false,
}

const emptyPost: SitePostPayload = {
  title: "",
  slug: "",
  summary: "",
  content_markdown: "",
  cover_image_url: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
  published_at: null,
}

const emptyDownloadLink: SiteDownloadLinkPayload = {
  platform: "ios",
  title: "",
  url: "",
  is_enabled: false,
  sort: 0,
}

export function SiteAdminPanel() {
  const [token, setToken] = useState("")
  const [state, setState] = useState<LoadState>(emptyState)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const [configForm, setConfigForm] = useState<SiteConfigPayload>(emptyConfig)
  const [newFeature, setNewFeature] = useState<SiteFeaturePayload>(emptyFeature)
  const [newFaq, setNewFaq] = useState<SiteFaqPayload>(emptyFaq)
  const [newPost, setNewPost] = useState<SitePostPayload>(emptyPost)
  const [newDownloadLink, setNewDownloadLink] = useState<SiteDownloadLinkPayload>(emptyDownloadLink)

  useEffect(() => {
    const saved = window.localStorage.getItem("dreamai-admin-token")
    if (saved) {
      setToken(saved)
    }
  }, [])

  function updateMessage(nextMessage: string, nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function requireToken() {
    const trimmed = token.trim()
    if (!trimmed) {
      updateMessage("", "请先填写管理员 Bearer Token。")
      return null
    }
    window.localStorage.setItem("dreamai-admin-token", trimmed)
    return trimmed
  }

  function loadAll() {
    const authToken = requireToken()
    if (!authToken) return

    startTransition(async () => {
      try {
        updateMessage("正在加载后台内容…")
        const [config, features, faqs, posts, downloadLinks] = await Promise.all([
          getAdminSiteConfig(authToken),
          getAdminSiteFeatures(authToken),
          getAdminSiteFaqs(authToken),
          getAdminSitePosts(authToken),
          getAdminSiteDownloadLinks(authToken),
        ])
        setState({
          config,
          features,
          faqs,
          posts: posts.items,
          downloadLinks,
        })
        setConfigForm(config)
        updateMessage("后台内容已刷新。")
      } catch (loadError) {
        updateMessage("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  async function saveConfig() {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await updateAdminSiteConfig(authToken, configForm)
        setState((current) => ({ ...current, config: saved }))
        setConfigForm(saved)
        updateMessage("站点配置已保存。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  async function createFeature() {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await createAdminSiteFeature(authToken, newFeature)
        setState((current) => ({ ...current, features: [...current.features, saved].sort((a, b) => a.sort - b.sort) }))
        setNewFeature(emptyFeature)
        updateMessage("功能项已创建。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  async function saveFeature(item: SiteFeature) {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
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
        setState((current) => ({
          ...current,
          features: current.features.map((feature) => (feature.id === saved.id ? saved : feature)).sort((a, b) => a.sort - b.sort),
        }))
        updateMessage(`功能 ${saved.title} 已更新。`)
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "更新失败")
      }
    })
  }

  async function createFaq() {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await createAdminSiteFaq(authToken, newFaq)
        setState((current) => ({ ...current, faqs: [...current.faqs, saved].sort((a, b) => a.sort - b.sort) }))
        setNewFaq(emptyFaq)
        updateMessage("FAQ 已创建。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  async function saveFaq(item: SiteFaq) {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await updateAdminSiteFaq(authToken, item.id, {
          question: item.question,
          answer: item.answer,
          sort: item.sort,
          is_published: item.is_published,
        })
        setState((current) => ({
          ...current,
          faqs: current.faqs.map((faq) => (faq.id === saved.id ? saved : faq)).sort((a, b) => a.sort - b.sort),
        }))
        updateMessage("FAQ 已更新。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "更新失败")
      }
    })
  }

  async function createPost() {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await createAdminSitePost(authToken, newPost)
        setState((current) => ({ ...current, posts: [saved, ...current.posts] }))
        setNewPost(emptyPost)
        updateMessage("文章已创建。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  async function savePost(item: SitePost) {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await updateAdminSitePost(authToken, item.id, {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          content_markdown: item.content_markdown,
          cover_image_url: item.cover_image_url,
          status: item.status,
          seo_title: item.seo_title,
          seo_description: item.seo_description,
          published_at: item.published_at ?? null,
        })
        setState((current) => ({
          ...current,
          posts: current.posts.map((post) => (post.id === saved.id ? saved : post)),
        }))
        updateMessage(`文章 ${saved.title} 已更新。`)
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "更新失败")
      }
    })
  }

  async function createDownloadLink() {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await createAdminSiteDownloadLink(authToken, newDownloadLink)
        setState((current) => ({
          ...current,
          downloadLinks: [...current.downloadLinks, saved].sort((a, b) => a.sort - b.sort),
        }))
        setNewDownloadLink(emptyDownloadLink)
        updateMessage("下载链接已创建。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  async function saveDownloadLink(item: SiteDownloadLink) {
    const authToken = requireToken()
    if (!authToken) return
    startTransition(async () => {
      try {
        const saved = await updateAdminSiteDownloadLink(authToken, item.id, {
          platform: item.platform,
          title: item.title,
          url: item.url,
          is_enabled: item.is_enabled,
          sort: item.sort,
        })
        setState((current) => ({
          ...current,
          downloadLinks: current.downloadLinks
            .map((link) => (link.id === saved.id ? saved : link))
            .sort((a, b) => a.sort - b.sort),
        }))
        updateMessage("下载链接已更新。")
      } catch (saveError) {
        updateMessage("", saveError instanceof Error ? saveError.message : "更新失败")
      }
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-float backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700">管理员 Bearer Token</label>
            <textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 min-h-24 w-full rounded-[1.5rem] border border-line bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="粘贴 /api/v1/auth 登录后得到的管理员 token"
            />
          </div>
          <button
            type="button"
            onClick={loadAll}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isPending ? "处理中…" : "加载后台内容"}
          </button>
        </div>
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      </div>

      <div className="mt-10 grid gap-10">
        <AdminSection
          title="站点配置"
          description="管理品牌文案、Hero、SEO、CTA 和联系信息。"
          action={
            <button
              type="button"
              onClick={saveConfig}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              保存配置
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Brand Name" value={configForm.brand_name || ""} onChange={(value) => setConfigForm((current) => ({ ...current, brand_name: value }))} />
            <Field label="App Name" value={configForm.app_name || ""} onChange={(value) => setConfigForm((current) => ({ ...current, app_name: value }))} />
            <Field label="Site Title" value={configForm.site_title || ""} onChange={(value) => setConfigForm((current) => ({ ...current, site_title: value }))} />
            <Field label="Contact Email" value={configForm.contact_email || ""} onChange={(value) => setConfigForm((current) => ({ ...current, contact_email: value }))} />
            <Field label="Primary CTA Text" value={configForm.primary_cta_text || ""} onChange={(value) => setConfigForm((current) => ({ ...current, primary_cta_text: value }))} />
            <Field label="Primary CTA Link" value={configForm.primary_cta_link || ""} onChange={(value) => setConfigForm((current) => ({ ...current, primary_cta_link: value }))} />
            <Field label="Secondary CTA Text" value={configForm.secondary_cta_text || ""} onChange={(value) => setConfigForm((current) => ({ ...current, secondary_cta_text: value }))} />
            <Field label="Secondary CTA Link" value={configForm.secondary_cta_link || ""} onChange={(value) => setConfigForm((current) => ({ ...current, secondary_cta_link: value }))} />
            <TextArea label="Site Subtitle" value={configForm.site_subtitle || ""} onChange={(value) => setConfigForm((current) => ({ ...current, site_subtitle: value }))} />
            <TextArea label="Hero Title" value={configForm.hero_title || ""} onChange={(value) => setConfigForm((current) => ({ ...current, hero_title: value }))} />
            <TextArea label="Hero Subtitle" value={configForm.hero_subtitle || ""} onChange={(value) => setConfigForm((current) => ({ ...current, hero_subtitle: value }))} />
            <TextArea label="SEO Description" value={configForm.seo_description || ""} onChange={(value) => setConfigForm((current) => ({ ...current, seo_description: value }))} />
            <Field label="SEO Title" value={configForm.seo_title || ""} onChange={(value) => setConfigForm((current) => ({ ...current, seo_title: value }))} />
            <Field label="Footer Text" value={configForm.footer_text || ""} onChange={(value) => setConfigForm((current) => ({ ...current, footer_text: value }))} />
          </div>
        </AdminSection>

        <CollectionSection
          title="功能模块"
          description="支持录入、修改、排序和上下线。"
          createAction={createFeature}
          createLabel="新增功能"
          createForm={
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Key" value={newFeature.key || ""} onChange={(value) => setNewFeature((current) => ({ ...current, key: value }))} />
              <Field label="Title" value={newFeature.title || ""} onChange={(value) => setNewFeature((current) => ({ ...current, title: value }))} />
              <Field label="Subtitle" value={newFeature.subtitle || ""} onChange={(value) => setNewFeature((current) => ({ ...current, subtitle: value }))} />
              <Field label="Tags" value={(newFeature.tags || []).join(", ")} onChange={(value) => setNewFeature((current) => ({ ...current, tags: splitTags(value) }))} />
              <Field label="Sort" value={String(newFeature.sort ?? 0)} onChange={(value) => setNewFeature((current) => ({ ...current, sort: toNumber(value) }))} />
              <Toggle label="Published" checked={Boolean(newFeature.is_published)} onChange={(checked) => setNewFeature((current) => ({ ...current, is_published: checked }))} />
              <TextArea label="Description" value={newFeature.description || ""} onChange={(value) => setNewFeature((current) => ({ ...current, description: value }))} />
              <TextArea label="Detail Content" value={newFeature.detail_content || ""} onChange={(value) => setNewFeature((current) => ({ ...current, detail_content: value }))} />
            </div>
          }
        >
          {state.features.map((feature) => (
            <EditableCard key={feature.id} title={feature.title} badge={feature.is_published ? "Published" : "Draft"} onSave={() => saveFeature(feature)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Key" value={feature.key} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, key: value } : item)) }))} />
                <Field label="Title" value={feature.title} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, title: value } : item)) }))} />
                <Field label="Subtitle" value={feature.subtitle || ""} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, subtitle: value } : item)) }))} />
                <Field label="Sort" value={String(feature.sort)} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, sort: toNumber(value) } : item)) }))} />
                <Field label="Tags" value={(feature.tags || []).join(", ")} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, tags: splitTags(value) } : item)) }))} />
                <Toggle label="Published" checked={feature.is_published} onChange={(checked) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, is_published: checked } : item)) }))} />
                <TextArea label="Description" value={feature.description || ""} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, description: value } : item)) }))} />
                <TextArea label="Detail Content" value={feature.detail_content || ""} onChange={(value) => setState((current) => ({ ...current, features: current.features.map((item) => (item.id === feature.id ? { ...item, detail_content: value } : item)) }))} />
              </div>
            </EditableCard>
          ))}
        </CollectionSection>

        <CollectionSection
          title="FAQ"
          description="按排序和发布状态管理前台 FAQ。"
          createAction={createFaq}
          createLabel="新增 FAQ"
          createForm={
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Question" value={newFaq.question || ""} onChange={(value) => setNewFaq((current) => ({ ...current, question: value }))} />
              <Field label="Sort" value={String(newFaq.sort ?? 0)} onChange={(value) => setNewFaq((current) => ({ ...current, sort: toNumber(value) }))} />
              <TextArea label="Answer" value={newFaq.answer || ""} onChange={(value) => setNewFaq((current) => ({ ...current, answer: value }))} />
              <Toggle label="Published" checked={Boolean(newFaq.is_published)} onChange={(checked) => setNewFaq((current) => ({ ...current, is_published: checked }))} />
            </div>
          }
        >
          {state.faqs.map((faq) => (
            <EditableCard key={faq.id} title={faq.question} badge={faq.is_published ? "Published" : "Draft"} onSave={() => saveFaq(faq)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Question" value={faq.question} onChange={(value) => setState((current) => ({ ...current, faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, question: value } : item)) }))} />
                <Field label="Sort" value={String(faq.sort)} onChange={(value) => setState((current) => ({ ...current, faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, sort: toNumber(value) } : item)) }))} />
                <TextArea label="Answer" value={faq.answer} onChange={(value) => setState((current) => ({ ...current, faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, answer: value } : item)) }))} />
                <Toggle label="Published" checked={faq.is_published} onChange={(checked) => setState((current) => ({ ...current, faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, is_published: checked } : item)) }))} />
              </div>
            </EditableCard>
          ))}
        </CollectionSection>

        <CollectionSection
          title="文章"
          description="支持博客与更新日志的录入、状态切换与发布时间控制。"
          createAction={createPost}
          createLabel="新增文章"
          createForm={
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={newPost.title || ""} onChange={(value) => setNewPost((current) => ({ ...current, title: value }))} />
              <Field label="Slug" value={newPost.slug || ""} onChange={(value) => setNewPost((current) => ({ ...current, slug: value }))} />
              <Field label="Status" value={newPost.status || "draft"} onChange={(value) => setNewPost((current) => ({ ...current, status: value }))} />
              <Field label="Published At (unix)" value={String(newPost.published_at ?? "")} onChange={(value) => setNewPost((current) => ({ ...current, published_at: value.trim() ? Number(value) : null }))} />
              <Field label="SEO Title" value={newPost.seo_title || ""} onChange={(value) => setNewPost((current) => ({ ...current, seo_title: value }))} />
              <Field label="SEO Description" value={newPost.seo_description || ""} onChange={(value) => setNewPost((current) => ({ ...current, seo_description: value }))} />
              <TextArea label="Summary" value={newPost.summary || ""} onChange={(value) => setNewPost((current) => ({ ...current, summary: value }))} />
              <TextArea label="Markdown Content" value={newPost.content_markdown || ""} onChange={(value) => setNewPost((current) => ({ ...current, content_markdown: value }))} />
            </div>
          }
        >
          {state.posts.map((post) => (
            <EditableCard key={post.id} title={post.title} badge={post.status} onSave={() => savePost(post)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title" value={post.title} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, title: value } : item)) }))} />
                <Field label="Slug" value={post.slug} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, slug: value } : item)) }))} />
                <Field label="Status" value={post.status} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, status: value } : item)) }))} />
                <Field label="Published At (unix)" value={String(post.published_at ?? "")} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, published_at: value.trim() ? Number(value) : undefined } : item)) }))} />
                <TextArea label="Summary" value={post.summary || ""} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, summary: value } : item)) }))} />
                <TextArea label="Markdown Content" value={post.content_markdown || ""} onChange={(value) => setState((current) => ({ ...current, posts: current.posts.map((item) => (item.id === post.id ? { ...item, content_markdown: value } : item)) }))} />
              </div>
            </EditableCard>
          ))}
        </CollectionSection>

        <CollectionSection
          title="下载链接"
          description="管理 App Store 和未来平台入口。"
          createAction={createDownloadLink}
          createLabel="新增下载链接"
          createForm={
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Platform" value={newDownloadLink.platform || ""} onChange={(value) => setNewDownloadLink((current) => ({ ...current, platform: value }))} />
              <Field label="Title" value={newDownloadLink.title || ""} onChange={(value) => setNewDownloadLink((current) => ({ ...current, title: value }))} />
              <Field label="URL" value={newDownloadLink.url || ""} onChange={(value) => setNewDownloadLink((current) => ({ ...current, url: value }))} />
              <Field label="Sort" value={String(newDownloadLink.sort ?? 0)} onChange={(value) => setNewDownloadLink((current) => ({ ...current, sort: toNumber(value) }))} />
              <Toggle label="Enabled" checked={Boolean(newDownloadLink.is_enabled)} onChange={(checked) => setNewDownloadLink((current) => ({ ...current, is_enabled: checked }))} />
            </div>
          }
        >
          {state.downloadLinks.map((link) => (
            <EditableCard key={link.id} title={link.title} badge={link.is_enabled ? "Enabled" : "Disabled"} onSave={() => saveDownloadLink(link)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Platform" value={link.platform} onChange={(value) => setState((current) => ({ ...current, downloadLinks: current.downloadLinks.map((item) => (item.id === link.id ? { ...item, platform: value } : item)) }))} />
                <Field label="Title" value={link.title} onChange={(value) => setState((current) => ({ ...current, downloadLinks: current.downloadLinks.map((item) => (item.id === link.id ? { ...item, title: value } : item)) }))} />
                <Field label="URL" value={link.url} onChange={(value) => setState((current) => ({ ...current, downloadLinks: current.downloadLinks.map((item) => (item.id === link.id ? { ...item, url: value } : item)) }))} />
                <Field label="Sort" value={String(link.sort)} onChange={(value) => setState((current) => ({ ...current, downloadLinks: current.downloadLinks.map((item) => (item.id === link.id ? { ...item, sort: toNumber(value) } : item)) }))} />
                <Toggle label="Enabled" checked={link.is_enabled} onChange={(checked) => setState((current) => ({ ...current, downloadLinks: current.downloadLinks.map((item) => (item.id === link.id ? { ...item, is_enabled: checked } : item)) }))} />
              </div>
            </EditableCard>
          ))}
        </CollectionSection>
      </div>
    </div>
  )
}

function AdminSection({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-[2.25rem] border border-line bg-white/88 p-8">
      <div className="flex flex-col gap-4 border-b border-line/80 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function CollectionSection({
  title,
  description,
  createForm,
  createAction,
  createLabel,
  children,
}: {
  title: string
  description: string
  createForm: ReactNode
  createAction: () => void
  createLabel: string
  children: ReactNode
}) {
  return (
    <AdminSection
      title={title}
      description={description}
      action={
        <button type="button" onClick={createAction} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          {createLabel}
        </button>
      }
    >
      <div className="rounded-[1.75rem] bg-mist/65 p-5">{createForm}</div>
      <div className="mt-6 grid gap-4">{children}</div>
    </AdminSection>
  )
}

function EditableCard({
  title,
  badge,
  onSave,
  children,
}: {
  title: string
  badge: string
  onSave: () => void
  children: ReactNode
}) {
  return (
    <article className="rounded-[1.8rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <span className="mt-2 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {badge}
          </span>
        </div>
        <button type="button" onClick={onSave} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          保存改动
        </button>
      </div>
      {children}
    </article>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[1.15rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-32 w-full rounded-[1.15rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 pt-8">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
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
