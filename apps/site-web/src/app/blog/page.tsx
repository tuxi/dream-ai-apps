import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PostGrid } from "@/components/sections/post-grid"
import { getSitePosts } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog")
  return {
    title: t("metadata.title"),
  }
}

export default async function BlogPage() {
  const t = await getTranslations("Blog")
  const posts = await getSitePosts()

  return <PostGrid posts={posts.items} title={t("title")} />
}
