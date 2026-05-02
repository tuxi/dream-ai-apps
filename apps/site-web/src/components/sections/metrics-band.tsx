import { getMessages, getTranslations } from "next-intl/server"

export async function MetricsBand() {
  const messages = (await getMessages()) as Record<string, unknown>
  const mbMessages = messages.MetricsBand as Record<string, unknown>
  const metrics = mbMessages.metrics as Array<{ label: string; value: string }>

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
