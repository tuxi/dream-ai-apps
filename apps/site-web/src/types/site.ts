export interface SiteConfig {
  brand_name: string
  app_name: string
  site_title: string
  site_subtitle?: string
  hero_title: string
  hero_subtitle?: string
  primary_cta_text?: string
  primary_cta_link?: string
  secondary_cta_text?: string
  secondary_cta_link?: string
  contact_email?: string
  footer_text?: string
  seo_title?: string
  seo_description?: string
  logo_url?: string
  favicon_url?: string
}

export interface SiteFeature {
  id: number
  key: string
  title: string
  subtitle?: string
  description?: string
  detail_content?: string
  cover_image_url?: string
  icon_url?: string
  tags?: string[]
  sort: number
  is_published: boolean
}

export interface SiteFaq {
  id: number
  question: string
  answer: string
  sort: number
  is_published: boolean
}

export interface SitePost {
  id: number
  title: string
  slug: string
  summary?: string
  content_markdown?: string
  cover_image_url?: string
  status: string
  seo_title?: string
  seo_description?: string
  published_at?: number
}

export interface SitePostList {
  items: SitePost[]
  page: number
  page_size: number
  total: number
}

export interface SiteDownloadLink {
  id: number
  platform: string
  title: string
  url: string
  is_enabled: boolean
  sort: number
}
