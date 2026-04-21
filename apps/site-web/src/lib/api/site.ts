import {
  SiteConfig,
  SiteDownloadLink,
  SiteFaq,
  SiteFeature,
  SitePost,
  SitePostList,
} from "@/types/site"
import {
  fallbackDownloadLinks,
  fallbackPostList,
  fallbackSiteConfig,
  fallbackSiteFaqs,
  fallbackSiteFeatures,
  fallbackSitePosts,
} from "@/lib/site-fallback"
import { getServerDeviceHeaders } from "@/lib/server-device"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1"
const ENABLE_API_FALLBACK =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_SITE_API_FALLBACK !== "false"

type ApiEnvelope<T> = {
  trace_id?: string
  code: number
  msg: string
  data: T
}

async function request<T>(path: string): Promise<T> {
  try {
    const deviceHeaders = await getServerDeviceHeaders()
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: deviceHeaders,
      next: { revalidate: 120 },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const payload = (await response.json()) as ApiEnvelope<T>
    if (payload.code !== 0) {
      throw new Error(payload.msg || "Request failed")
    }

    return payload.data
  } catch (error) {
    if (ENABLE_API_FALLBACK) {
      return getFallback(path) as T
    }
    throw error
  }
}

export function getSiteConfig() {
  return request<SiteConfig>("/site/config")
}

export function getSiteFeatures() {
  return request<SiteFeature[]>("/site/features")
}

export function getSiteFaqs() {
  return request<SiteFaq[]>("/site/faqs")
}

export function getSitePosts(page = 1, pageSize = 10) {
  return request<SitePostList>(`/site/posts?page=${page}&page_size=${pageSize}`)
}

export function getSitePostBySlug(slug: string) {
  return request<SitePost>(`/site/posts/${slug}`)
}

export function getSiteDownloadLinks() {
  return request<SiteDownloadLink[]>("/site/download-links")
}

function getFallback(path: string) {
  if (path === "/site/config") return fallbackSiteConfig
  if (path === "/site/features") return fallbackSiteFeatures
  if (path === "/site/faqs") return fallbackSiteFaqs
  if (path === "/site/download-links") return fallbackDownloadLinks
  if (path.startsWith("/site/posts?")) return fallbackPostList
  if (path.startsWith("/site/posts/")) {
    const slug = path.replace("/site/posts/", "")
    const post = fallbackSitePosts.find((item) => item.slug === slug)
    if (post) return post
    throw new Error("Post not found")
  }
  return fallbackPostList
}
