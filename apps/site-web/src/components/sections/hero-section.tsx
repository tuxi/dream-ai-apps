import Link from "next/link"

import { SiteConfig, SiteDownloadLink } from "@/types/site"

export function HeroSection({
  config,
  downloads,
}: {
  config: SiteConfig
  downloads: SiteDownloadLink[]
}) {
  const primaryLink = downloads[0]?.url || config.primary_cta_link || "/download"

  return (
    <section className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
      <div className="relative">
        <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
          DreamAI by Dreamlog
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          {config.hero_title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{config.hero_subtitle}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={primaryLink}
            className="rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {config.primary_cta_text || "Download on the App Store"}
          </Link>
          <Link
            href={config.secondary_cta_link || "/features"}
            className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition hover:border-slate-400"
          >
            {config.secondary_cta_text || "Explore Features"}
          </Link>
        </div>
        <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
          {["Text-led ideation", "Motion intent", "Commerce storytelling"].map((item) => (
            <div key={item} className="rounded-[1.3rem] border border-line/80 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-float backdrop-blur">
        <div className="absolute inset-x-10 top-10 h-24 rounded-full bg-sunrise/10 blur-3xl" />
        <div className="relative rounded-[1.8rem] border border-line/70 bg-[linear-gradient(180deg,#ffffff,#f5f9ff)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-sunrise" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Product preview</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Text to video concepts",
              "Image-led motion",
              "Start/end frame control",
              "Commerce storytelling",
            ].map((item, index) => (
              <div key={item} className="rounded-[1.5rem] bg-mist p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Flow {index + 1}</p>
                <p className="mt-3 text-lg font-medium text-ink">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.7rem] bg-[linear-gradient(135deg,#102033,#0f766e)] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">Website Phase One</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              Brand storytelling, feature education, and App Store conversion.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
