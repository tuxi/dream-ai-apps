import { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/sections/page-hero"
import { formatUnixDate } from "@/lib/format"
import { getSitePostBySlug } from "@/lib/api/site"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const post = await getSitePostBySlug(params.slug)
    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary,
    }
  } catch {
    return {
      title: "Post | DreamAI",
    }
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const post = await getSitePostBySlug(params.slug)

    return (
      <div className="pb-20">
        <PageHero
          eyebrow="Blog"
          title={post.title}
          description={post.summary || "Product note, launch context, and positioning detail from the DreamAI team."}
          aside={
            <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Article meta</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.25rem] bg-mist p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Published</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{formatUnixDate(post.published_at)}</p>
                </div>
                <div className="rounded-[1.25rem] bg-white p-4 ring-1 ring-line">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{post.status}</p>
                </div>
              </div>
            </div>
          }
        />
        <article className="mx-auto max-w-6xl px-6 pt-10">
          <div className="grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
            <aside className="rounded-[2rem] border border-line bg-white/88 p-6 lg:sticky lg:top-28 lg:h-fit">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Reading note</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                The blog is designed as a lightweight content layer for launches, updates, and product positioning, backed by the same content API that drives the public site.
              </p>
            </aside>
            <div className="rounded-[2.2rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-8 shadow-sm">
              <div className="whitespace-pre-wrap text-base leading-9 text-slate-700">{post.content_markdown}</div>
            </div>
          </div>
        </article>
      </div>
    )
  } catch {
    notFound()
  }
}
