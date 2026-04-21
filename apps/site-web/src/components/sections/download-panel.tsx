import Link from "next/link"

import { SiteDownloadLink } from "@/types/site"

import { SectionTitle } from "./section-title"

export function DownloadPanel({ links }: { links: SiteDownloadLink[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-[2.25rem] bg-[linear-gradient(135deg,#102033,#0f766e,#f97316)] p-10 text-white shadow-float">
        <SectionTitle
          eyebrow="Download"
          title="Start with the mobile app today"
          description="Phase one of the website is optimized for discovery and conversion, so the call to action stays simple and prominent."
        />
        <div className="mt-8 flex flex-wrap gap-4">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Mobile-first experience", "API-driven content", "Ready for CMS extension"].map((item) => (
            <div key={item} className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-sm text-white/82">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
