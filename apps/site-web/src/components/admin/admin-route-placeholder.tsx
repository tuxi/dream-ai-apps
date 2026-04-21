import Link from "next/link"

type PlaceholderLink = {
  href: string
  label: string
}

export function AdminRoutePlaceholder({
  eyebrow,
  title,
  description,
  status,
  scope,
  links,
}: {
  eyebrow: string
  title: string
  description: string
  status: string
  scope: string[]
  links?: PlaceholderLink[]
}) {
  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.95),rgba(240,253,250,0.95))] p-8 shadow-float">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,32,51,0.08),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-5 text-base leading-8 text-slate-600">{description}</p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white/85 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-2 text-sm font-semibold text-ink">{status}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-line bg-white/90 p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Planned Scope</p>
          <div className="mt-5 grid gap-3">
            {scope.map((item) => (
              <div key={item} className="rounded-[1.2rem] bg-mist px-4 py-4 text-sm leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Implementation Note</p>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            This route is now part of the unified admin skeleton. Next step is to replace the placeholder with real list,
            filter, detail, and mutation flows against the confirmed backend APIs.
          </p>
          {links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
