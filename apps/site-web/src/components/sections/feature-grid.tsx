import { getTranslations } from "next-intl/server"

import { SiteFeature } from "@/types/site"

import { SectionTitle } from "./section-title"

export async function FeatureGrid({ features }: { features: SiteFeature[] }) {
  const t = await getTranslations("FeatureGrid")

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.id}
            className="rounded-[2rem] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,249,255,0.95))] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{feature.key}</p>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {t("live")}
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{feature.title}</h3>
            {feature.subtitle ? <p className="mt-3 text-base text-slate-700">{feature.subtitle}</p> : null}
            {feature.description ? <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p> : null}
            {feature.detail_content ? (
              <p className="mt-4 rounded-[1.3rem] bg-white/70 p-4 text-sm leading-7 text-slate-600">{feature.detail_content}</p>
            ) : null}
            {feature.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
