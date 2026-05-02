import type { Metadata } from "next"
import { getMessages, getTranslations } from "next-intl/server"

import { PageHero } from "@/components/sections/page-hero"
import { DownloadPanel } from "@/components/sections/download-panel"
import { getSiteDownloadLinks } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Download")
  return {
    title: t("metadata.title"),
  }
}

export default async function DownloadPage() {
  const t = await getTranslations("Download")
  const messages = (await getMessages()) as Record<string, unknown>
  const downloadMessages = messages.Download as Record<string, unknown>
  const asideMessages = downloadMessages.aside as Record<string, unknown>
  const asideItems = asideMessages.items as string[]
  const links = await getSiteDownloadLinks()

  return (
    <div className="pb-20">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        aside={
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("aside.label")}</p>
            <div className="mt-5 grid gap-3">
              {asideItems.map((item) => (
                <div key={item} className="rounded-[1.25rem] bg-mist px-4 py-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t("cards.platform.title")}</p>
            <p className="mt-4 text-2xl font-semibold text-ink">{t("cards.platform.headline")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t("cards.platform.description")}</p>
          </div>
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t("cards.role.title")}</p>
            <p className="mt-4 text-2xl font-semibold text-ink">{t("cards.role.headline")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t("cards.role.description")}</p>
          </div>
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t("cards.future.title")}</p>
            <p className="mt-4 text-2xl font-semibold text-ink">{t("cards.future.headline")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t("cards.future.description")}</p>
          </div>
        </div>
      </section>
      <DownloadPanel links={links} />
    </div>
  )
}
