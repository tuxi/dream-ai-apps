import { PageHero } from "@/components/sections/page-hero"

const principles = [
  {
    title: "Product clarity first",
    description:
      "The site explains what DreamAI does today instead of pretending the web already offers the full in-app workflow.",
  },
  {
    title: "Brand and product separation",
    description:
      "Dreamlog stays the outward-facing brand, while DreamAI remains the App Store product users download and remember.",
  },
  {
    title: "Built to grow into content operations",
    description:
      "The content model already supports configuration, features, FAQs, posts, and download links so later CMS work is incremental.",
  },
]

export const metadata = {
  title: "About | DreamAI",
}

export default function AboutPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="About"
        title="DreamAI is the product, Dreamlog is the brand"
        description="The website follows the naming strategy in the doc: Dreamlog is the outward-facing brand, while DreamAI is the App Store product users download."
        aside={
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Brand system</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.35rem] bg-mist p-4">
                <p className="text-sm font-semibold text-ink">Dreamlog</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Brand identity, domain, and external narrative.</p>
              </div>
              <div className="rounded-[1.35rem] bg-white p-4 ring-1 ring-line">
                <p className="text-sm font-semibold text-ink">DreamAI</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">The AI video product users discover here and download from the App Store.</p>
              </div>
            </div>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.2rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Why this site exists</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">A sharper story before a broader platform.</h2>
            <p className="mt-5 text-sm leading-8 text-slate-600">
              Phase one is intentionally narrow. It explains product value, introduces core workflows, and creates a clean path to app download without recreating in-app generation on the web.
            </p>
            <div className="mt-8 grid gap-4">
              {principles.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] bg-white/85 p-5 ring-1 ring-line/80">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.2rem] bg-[linear-gradient(145deg,#102033,#17395d,#0f766e)] p-8 text-white shadow-float">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">Architecture note</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">The site grows from the existing Go business layer.</h2>
            <p className="mt-5 text-sm leading-8 text-white/74">
              The content layer is attached to the current backend instead of being built as an isolated prototype, which keeps routing, response wrapping, and future operations closer to the real product stack.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Frontend</p>
                <p className="mt-3 text-lg font-semibold">`apps/site-web`</p>
                <p className="mt-2 text-sm leading-7 text-white/72">Next.js, TypeScript, Tailwind, API-driven content fetching.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Backend</p>
                <p className="mt-3 text-lg font-semibold">Existing Go service</p>
                <p className="mt-2 text-sm leading-7 text-white/72">Adds `/api/v1/site/*` and `/api/v1/admin/site/*` without breaking the original business rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
