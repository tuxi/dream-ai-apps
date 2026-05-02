import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"

import { formatUnixDate } from "@/lib/format"
import { SitePost } from "@/types/site"

import { SectionTitle } from "./section-title"

export async function PostGrid({
  posts,
  title,
  eyebrow,
}: {
  posts: SitePost[]
  title?: string
  eyebrow?: string
}) {
  const t = await getTranslations("PostGrid")
  const locale = await getLocale()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle
        eyebrow={eyebrow || t("eyebrow")}
        title={title || t("title")}
        description={t("description")}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="rounded-[2rem] border border-line bg-white/90 p-8">
            <p className="text-sm text-slate-500">{formatUnixDate(post.published_at, locale)}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{post.title}</h3>
            {post.summary ? <p className="mt-4 text-sm leading-7 text-slate-600">{post.summary}</p> : null}
            <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-accent">
              {t("readArticle")}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
