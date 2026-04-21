import type { ReactNode } from "react"

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string
  title: string
  description: string
  aside?: ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-14">
      <div className="relative overflow-hidden rounded-[2.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(238,244,255,0.92),rgba(255,247,237,0.9))] p-8 shadow-float backdrop-blur md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
          </div>
          {aside ? <div className="relative">{aside}</div> : null}
        </div>
      </div>
    </section>
  )
}
