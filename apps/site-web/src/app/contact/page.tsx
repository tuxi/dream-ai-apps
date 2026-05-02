import type { Metadata } from "next"
import { getMessages, getTranslations } from "next-intl/server"

import { PageHero } from "@/components/sections/page-hero"
import { SectionTitle } from "@/components/sections/section-title"
import { getSiteConfig } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact")
  return {
    title: t("metadata.title"),
  }
}

export default async function ContactPage() {
  const t = await getTranslations("Contact")
  const messages = (await getMessages()) as Record<string, unknown>
  const contactMessages = messages.Contact as Record<string, unknown>
  const supportMessages = contactMessages.support as Record<string, unknown>
  const whatToAskItems = supportMessages.whatToAskItems as string[]
  const config = await getSiteConfig()

  return (
    <div className="pb-20">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        aside={
          <div className="rounded-[2rem] bg-[linear-gradient(145deg,#102033,#0f766e)] p-6 text-white shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{t("aside.label")}</p>
            <p className="mt-4 text-2xl font-semibold">{config.contact_email}</p>
            <p className="mt-3 text-sm leading-7 text-white/72">{t("aside.description")}</p>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.1rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] p-8">
            <SectionTitle
              eyebrow={t("support.eyebrow")}
              title={t("support.title")}
              description={t("support.description")}
            />
            <div className="mt-8 rounded-[1.6rem] bg-white p-6 ring-1 ring-line/80">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("support.emailLabel")}</p>
              <a href={`mailto:${config.contact_email}`} className="mt-4 block text-3xl font-semibold tracking-tight text-ink">
                {config.contact_email}
              </a>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {t("support.description")}
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-line bg-white/88 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t("support.whatToAsk")}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {whatToAskItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-line bg-white/88 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t("support.simplePurpose")}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {t("support.simplePurposeText")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
