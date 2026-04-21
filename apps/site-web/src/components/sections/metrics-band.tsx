const metrics = [
  { label: "Website goal", value: "Download conversion" },
  { label: "Content system", value: "API-driven" },
  { label: "Frontend stack", value: "Next.js + Tailwind" },
  { label: "Backend shape", value: "Existing Go business rules" },
]

export function MetricsBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="grid gap-4 rounded-[2.1rem] border border-line/80 bg-white/88 p-6 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.4rem] bg-mist/70 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
            <p className="mt-3 text-lg font-semibold text-ink">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
