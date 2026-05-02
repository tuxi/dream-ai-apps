import {
  SiteConfig,
  SiteDownloadLink,
  SiteFaq,
  SiteFeature,
  SitePost,
  SitePostList,
} from "@/types/site"
import { getClientDeviceHeaders } from "@/lib/client-device"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1"

type ApiEnvelope<T> = {
  code: number
  msg: string
  data: T
}

export type SiteConfigPayload = SiteConfig

export type SiteFeaturePayload = {
  key: string
  title: string
  subtitle?: string
  description?: string
  detail_content?: string
  cover_image_url?: string
  icon_url?: string
  tags?: string[]
  sort?: number
  is_published?: boolean
}

export type SiteFaqPayload = {
  question: string
  answer: string
  sort?: number
  is_published?: boolean
}

export type SitePostPayload = {
  title: string
  slug: string
  summary?: string
  content_markdown?: string
  cover_image_url?: string
  status?: string
  seo_title?: string
  seo_description?: string
  published_at?: number | null
}

export type SiteDownloadLinkPayload = {
  platform: string
  title: string
  url: string
  is_enabled?: boolean
  sort?: number
}

export type AdminMediaStsResponse = {
  access_key_id: string
  access_key_secret: string
  security_token: string
  expiration: string
  bucket: string
  region: string
  endpoint: string
  host: string
  dir: string
  user_id: number
}

async function request<T>(path: string, options: RequestInit & { token: string }): Promise<T> {
  const deviceHeaders = getClientDeviceHeaders()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`,
      ...deviceHeaders,
      ...(options.headers || {}),
    },
  })

  const payload = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.msg || `Request failed: ${response.status}`)
  }

  return payload.data
}

export function getAdminSiteConfig(token: string) {
  return request<SiteConfig>("/admin/site/config", { method: "GET", token })
}

export function getAdminMediaSts(token: string) {
  return request<AdminMediaStsResponse>("/admin/media/sts", { method: "GET", token })
}

export function updateAdminSiteConfig(token: string, body: SiteConfigPayload) {
  return request<SiteConfig>("/admin/site/config", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function getAdminSiteFeatures(token: string) {
  return request<SiteFeature[]>("/admin/site/features", { method: "GET", token })
}

export function createAdminSiteFeature(token: string, body: SiteFeaturePayload) {
  return request<SiteFeature>("/admin/site/features", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}

export function updateAdminSiteFeature(token: string, id: number, body: SiteFeaturePayload) {
  return request<SiteFeature>(`/admin/site/features/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function deleteAdminSiteFeature(token: string, id: number) {
  return request<Record<string, never>>(`/admin/site/features/${id}`, {
    method: "DELETE",
    token,
  })
}

export function getAdminSiteFaqs(token: string) {
  return request<SiteFaq[]>("/admin/site/faqs", { method: "GET", token })
}

export function createAdminSiteFaq(token: string, body: SiteFaqPayload) {
  return request<SiteFaq>("/admin/site/faqs", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}

export function updateAdminSiteFaq(token: string, id: number, body: SiteFaqPayload) {
  return request<SiteFaq>(`/admin/site/faqs/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function deleteAdminSiteFaq(token: string, id: number) {
  return request<Record<string, never>>(`/admin/site/faqs/${id}`, {
    method: "DELETE",
    token,
  })
}

export function getAdminSitePosts(
  token: string,
  params: {
    page?: number
    page_size?: number
    status?: string
  } = {},
) {
  const search = new URLSearchParams()
  search.set("page", String(params.page ?? 1))
  search.set("page_size", String(params.page_size ?? 50))
  if (params.status) {
    search.set("status", params.status)
  }

  return request<SitePostList>(`/admin/site/posts?${search.toString()}`, { method: "GET", token })
}

export function createAdminSitePost(token: string, body: SitePostPayload) {
  return request<SitePost>("/admin/site/posts", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}

export function updateAdminSitePost(token: string, id: number, body: SitePostPayload) {
  return request<SitePost>(`/admin/site/posts/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function deleteAdminSitePost(token: string, id: number) {
  return request<Record<string, never>>(`/admin/site/posts/${id}`, {
    method: "DELETE",
    token,
  })
}

export function getAdminSiteDownloadLinks(token: string) {
  return request<SiteDownloadLink[]>("/admin/site/download-links", { method: "GET", token })
}

export function createAdminSiteDownloadLink(token: string, body: SiteDownloadLinkPayload) {
  return request<SiteDownloadLink>("/admin/site/download-links", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}

export function updateAdminSiteDownloadLink(token: string, id: number, body: SiteDownloadLinkPayload) {
  return request<SiteDownloadLink>(`/admin/site/download-links/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function deleteAdminSiteDownloadLink(token: string, id: number) {
  return request<Record<string, never>>(`/admin/site/download-links/${id}`, {
    method: "DELETE",
    token,
  })
}
