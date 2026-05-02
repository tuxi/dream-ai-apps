import { getMessages, getTranslations } from "next-intl/server"

export async function ScenarioStrip() {
  const messages = (await getMessages()) as Record<string, unknown>
  const ssMessages = messages.ScenarioStrip as Record<string, unknown>
  const scenarios = ssMessages.scenarios as Array<{ title: string; description: string }>

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-4 rounded-[2.25rem] border border-white/70 bg-white/75 p-5 shadow-float backdrop-blur md:grid-cols-3">
        {scenarios.map((scenario) => (
          <article key={scenario.title} className="rounded-[1.5rem] bg-[linear-gradient(180deg,#ffffff,rgba(238,244,255,0.9))] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{scenario.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{scenario.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
