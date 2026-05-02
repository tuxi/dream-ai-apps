import type { Metadata } from "next"
import Link from "next/link"
import { getMessages, getTranslations } from "next-intl/server"

import { PageHero } from "@/components/sections/page-hero"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About")
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function AboutPage() {
  const t = await getTranslations("About")
  const messages = (await getMessages()) as Record<string, unknown>
  const aboutMessages = messages.About as Record<string, unknown>
  const milestones = aboutMessages.milestones as Array<{ label: string; title: string; description: string }>

  return (
    <div className="pb-20">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        aside={
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("brandPanel.label")}</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.35rem] bg-mist p-4">
                <p className="text-sm font-semibold text-ink">{t("brandPanel.developer.name")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t("brandPanel.developer.desc")}</p>
              </div>
              <div className="rounded-[1.35rem] bg-white p-4 ring-1 ring-line">
                <p className="text-sm font-semibold text-ink">{t("brandPanel.product.name")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t("brandPanel.product.desc")}</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {milestones.map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-line bg-white/90 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{item.label}</p>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2.2rem] bg-[linear-gradient(145deg,#102033,#17395d,#0f766e)] p-10 text-white shadow-float">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">{t("contactSection.eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">{t("contactSection.title")}</h2>
            <p className="mt-5 text-sm leading-8 text-white/74">{t("contactSection.description")}</p>
            <a
              href="mailto:support@dreamlog.com"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              support@dreamlog.com
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-line bg-white/90 p-8">
          <h2 className="text-lg font-semibold text-ink mb-5">{t("filingSection.title")}</h2>
          <div className="grid gap-4 text-sm leading-7 text-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("filingSection.operator")}</p>
              <p className="mt-1 font-semibold">{t("filingSection.operatorName")}</p>
              <p className="mt-0.5 text-slate-500">{t("filingSection.operatorDesc")}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("filingSection.github")}</p>
              <p className="mt-1">
                <a
                  href="https://github.com/tuxi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent"
                >
                  github.com/tuxi
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("filingSection.icp")}</p>
              <p className="mt-1">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent"
                >
                  京ICP备19030687号
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("filingSection.contactEmail")}</p>
              <p className="mt-1">
                <a href="mailto:support@dreamlog.com" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">
                  support@dreamlog.com
                </a>
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("filingSection.legalDocs")}</p>
              <p className="mt-1 flex gap-3">
                <Link href="/privacy" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">{t("filingSection.privacy")}</Link>
                <Link href="/terms" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">{t("filingSection.terms")}</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
