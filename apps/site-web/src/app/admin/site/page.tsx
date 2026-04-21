import type { Metadata } from "next"
import Link from "next/link"

import { SiteAdminPanel } from "@/components/admin/site-admin-panel"

export const metadata: Metadata = {
  title: "Site CMS",
  description: "Website content management workspace for DreamAI.",
}

export default function SiteAdminPage() {
  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(238,244,255,0.95),rgba(255,247,237,0.94))] p-8 shadow-float">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Website content operations start here</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              This workspace owns brand copy, hero content, FAQs, blog posts, feature modules, and download entry points
              that power the public DreamAI website.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-line bg-white/85 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Current State</p>
            <p className="mt-3 text-xl font-semibold text-ink">Existing all-in-one editor retained</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The current monolithic site editor remains available below while we transition the admin area into modular
              routes.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            href: "/admin/site/config",
            title: "Config",
            description: "Global brand, hero, CTA, SEO, and contact settings.",
          },
          {
            href: "/admin/site/features",
            title: "Features",
            description: "Feature cards, publish state, tags, and ordering.",
          },
          {
            href: "/admin/site/faqs",
            title: "FAQs",
            description: "Question and answer content with sort and publish control.",
          },
          {
            href: "/admin/site/posts",
            title: "Posts",
            description: "Blog and update posts, status, slug, and publish timing.",
          },
          {
            href: "/admin/site/download-links",
            title: "Download Links",
            description: "Platform entry points and enable or disable state.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.8rem] border border-line bg-white/90 p-6 transition hover:-translate-y-0.5 hover:shadow-float"
          >
            <p className="text-lg font-semibold text-ink">{item.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </section>

      <SiteAdminPanel />
    </div>
  )
}
