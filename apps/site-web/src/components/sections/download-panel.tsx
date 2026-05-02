import Link from "next/link"
import { getMessages, getTranslations } from "next-intl/server"

import { SiteDownloadLink } from "@/types/site"

import { SectionTitle } from "./section-title"

export async function DownloadPanel({ links }: { links: SiteDownloadLink[] }) {
  const t = await getTranslations("DownloadPanel")
  const messages = (await getMessages()) as Record<string, unknown>
  const dpMessages = messages.DownloadPanel as Record<string, unknown>
  const features = dpMessages.features as string[]

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-[2.25rem] bg-[linear-gradient(135deg,#102033,#0f766e,#f97316)] p-10 text-white shadow-float">
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
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
          {features.map((item) => (
            <div key={item} className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-sm text-white/82">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
