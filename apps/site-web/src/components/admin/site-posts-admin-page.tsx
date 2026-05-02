"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminImageUploadField } from "@/components/admin/admin-image-upload-field"
import { AdminField, AdminSectionCard, AdminTextarea } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  createAdminSitePost,
  deleteAdminSitePost,
  getAdminSitePosts,
  type SitePostPayload,
  updateAdminSitePost,
} from "@/lib/api/site-admin"
import { formatUnixDateTime } from "@/lib/format"
import type { SitePost } from "@/types/site"

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

export function SitePostsAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [posts, setPosts] = useState<SitePost[]>([])
  const [statusFilter, setStatusFilter] = useState("")
  const [newPost, setNewPost] = useState<SitePostPayload>(emptyPost)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadPosts(nextStatus = statusFilter) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载文章列表…")
        const response = await getAdminSitePosts(authToken, {
          page: 1,
          page_size: 50,
          status: nextStatus || undefined,
        })
        setPosts(response.items)
        updateFeedback(`已加载 ${response.items.length} 篇文章。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function createPost() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在创建文章…")
        const saved = await createAdminSitePost(authToken, newPost)
        setPosts((current) => [saved, ...current])
        setNewPost(emptyPost)
        updateFeedback("文章已创建。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  function savePost(item: SitePost) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback(`正在保存 ${item.title}…`)
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
        setPosts((current) => current.map((post) => (post.id === saved.id ? saved : post)))
        updateFeedback(`文章 ${saved.title} 已保存。`)
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  function removePost(item: SitePost) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "当前管理员会话不存在，请先登录后台。")
      return
    }
    if (!window.confirm(`确认删除文章「${item.title}」吗？`)) {
      return
    }

    startTransition(async () => {
      try {
        updateFeedback(`正在删除 ${item.title}…`)
        await deleteAdminSitePost(authToken, item.id)
        setPosts((current) => current.filter((post) => post.id !== item.id))
        updateFeedback(`文章 ${item.title} 已删除。`)
      } catch (removeError) {
        updateFeedback("", removeError instanceof Error ? removeError.message : "删除失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadPosts("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Post operations</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Manage blog and update posts with status filtering, slug control, markdown content editing, and publish timestamps.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={() => loadPosts()}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Filter Posts"
        description="Filter the admin post list by status."
        action={
          <button type="button" onClick={() => loadPosts()} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "刷新列表"}
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,18rem)_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Create Post"
        description="Create a new post entry backed by the site admin post API."
        action={
          <button type="button" onClick={createPost} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "新增文章"}
          </button>
        }
      >
        <PostForm post={newPost} token={token} onChange={setNewPost} />
      </AdminSectionCard>

      <div className="grid gap-4">
        {posts.map((post) => (
          <AdminSectionCard
            key={post.id}
            title={post.title}
            description={`Slug: ${post.slug}`}
            action={
              <div className="flex items-center gap-3">
                <AdminStatusBadge label={post.status} tone={post.status === "published" ? "green" : post.status === "offline" ? "rose" : "amber"} />
                <button
                  type="button"
                  onClick={() => removePost(post)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                >
                  删除
                </button>
                <button
                  type="button"
                  onClick={() => savePost(post)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  保存改动
                </button>
              </div>
            }
          >
            <div className="mb-4 rounded-[1.25rem] bg-mist/70 px-4 py-3 text-sm text-slate-600">
              Published At: {post.published_at ? formatUnixDateTime(post.published_at) : "Not set"}
            </div>
            <PostForm
              post={post}
              token={token}
              onChange={(nextPost) =>
                setPosts((current) =>
                  current.map((item) =>
                    item.id === post.id
                      ? {
                          ...item,
                          ...nextPost,
                          published_at: nextPost.published_at ?? undefined,
                        }
                      : item,
                  ),
                )
              }
            />
          </AdminSectionCard>
        ))}
      </div>
    </div>
  )
}

function PostForm({
  post,
  token,
  onChange,
}: {
  post: SitePostPayload
  token: string
  onChange: (post: SitePostPayload) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminField label="Title" value={post.title || ""} onChange={(value) => onChange({ ...post, title: value })} />
      <AdminField label="Slug" value={post.slug || ""} onChange={(value) => onChange({ ...post, slug: value })} />
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Status</span>
        <select
          value={post.status || "draft"}
          onChange={(event) => onChange({ ...post, status: event.target.value })}
          className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="offline">Offline</option>
        </select>
      </label>
      <AdminField
        label="Published At (unix)"
        value={String(post.published_at ?? "")}
        onChange={(value) => onChange({ ...post, published_at: value.trim() ? Number(value) : null })}
      />
      <AdminField label="Cover URL" value={post.cover_image_url || ""} onChange={(value) => onChange({ ...post, cover_image_url: value })} />
      <AdminImageUploadField label="Upload Cover" value={post.cover_image_url || ""} token={token} onChange={(value) => onChange({ ...post, cover_image_url: value })} />
      <AdminField label="SEO Title" value={post.seo_title || ""} onChange={(value) => onChange({ ...post, seo_title: value })} />
      <AdminTextarea label="Summary" value={post.summary || ""} onChange={(value) => onChange({ ...post, summary: value })} />
      <AdminTextarea label="SEO Description" value={post.seo_description || ""} onChange={(value) => onChange({ ...post, seo_description: value })} />
      <AdminTextarea
        label="Markdown Content"
        value={post.content_markdown || ""}
        onChange={(value) => onChange({ ...post, content_markdown: value })}
        minHeightClass="min-h-56"
      />
    </div>
  )
}
