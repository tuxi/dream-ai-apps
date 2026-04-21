import Link from "next/link"

import { formatUnixDate } from "@/lib/format"
import { SitePost } from "@/types/site"

import { SectionTitle } from "./section-title"

export function PostGrid({
  posts,
  title = "Latest updates",
  eyebrow = "Blog",
}: {
  posts: SitePost[]
  title?: string
  eyebrow?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle eyebrow={eyebrow} title={title} description="Use the blog as a lightweight content system for product updates, launches, and positioning notes." />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="rounded-[2rem] border border-line bg-white/90 p-8">
            <p className="text-sm text-slate-500">{formatUnixDate(post.published_at)}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{post.title}</h3>
            {post.summary ? <p className="mt-4 text-sm leading-7 text-slate-600">{post.summary}</p> : null}
            <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-accent">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
