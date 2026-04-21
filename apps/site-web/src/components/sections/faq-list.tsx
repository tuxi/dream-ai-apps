import { SiteFaq } from "@/types/site"

import { SectionTitle } from "./section-title"

export function FAQList({ faqs, compact = false }: { faqs: SiteFaq[]; compact?: boolean }) {
  const items = compact ? faqs.slice(0, 4) : faqs

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle
        eyebrow="FAQ"
        title="Questions teams ask before they download"
        description="Phase one focuses on clarity: what DreamAI is, what it does today, and how the product direction maps to real workflows."
      />
      <div className="mt-10 space-y-4">
        {items.map((faq) => (
          <details key={faq.id} className="group rounded-[1.75rem] border border-line bg-white/90 p-6" open={!compact}>
            <summary className="cursor-pointer list-none text-lg font-semibold text-ink">{faq.question}</summary>
            <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
