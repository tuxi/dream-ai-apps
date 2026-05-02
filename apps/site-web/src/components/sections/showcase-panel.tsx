import { getTranslations } from "next-intl/server"

import { SiteFeature } from "@/types/site"

import { SectionTitle } from "./section-title"

export async function ShowcasePanel({ features }: { features: SiteFeature[] }) {
  const t = await getTranslations("ShowcasePanel")

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(145deg,#102033,#153456,#0f766e)] p-8 text-white shadow-float">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)]" />
          <div className="relative">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">{t("canvas")}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{t("creativeFlows")}</h3>
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  {t("phase")}
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {features.slice(0, 4).map((feature) => (
                  <div key={feature.id} className="rounded-[1.4rem] border border-white/10 bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">{feature.key}</p>
                    <p className="mt-2 text-lg font-semibold">{feature.title}</p>
                    {feature.subtitle ? <p className="mt-2 text-sm leading-6 text-white/72">{feature.subtitle}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
