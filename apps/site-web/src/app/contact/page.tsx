import { PageHero } from "@/components/sections/page-hero"
import { SectionTitle } from "@/components/sections/section-title"
import { getSiteConfig } from "@/lib/api/site"

export const metadata = {
  title: "Contact | DreamAI",
}

export default async function ContactPage() {
  const config = await getSiteConfig()

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Contact"
        title="Reach the DreamAI team"
        description="Contact is simple in phase one, but it still belongs in the same polished experience as the rest of the site. The primary channel is managed from the site config API."
        aside={
          <div className="rounded-[2rem] bg-[linear-gradient(145deg,#102033,#0f766e)] p-6 text-white shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Support channel</p>
            <p className="mt-4 text-2xl font-semibold">{config.contact_email}</p>
            <p className="mt-3 text-sm leading-7 text-white/72">A lightweight support route now, with room for richer contact workflows later.</p>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.1rem] border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] p-8">
            <SectionTitle
              eyebrow="Support"
              title="A clear contact path is part of the product promise"
              description="Even in a lean website release, trust comes from showing where users can go when they need help, clarification, or follow-up."
            />
            <div className="mt-8 rounded-[1.6rem] bg-white p-6 ring-1 ring-line/80">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Support email</p>
              <a href={`mailto:${config.contact_email}`} className="mt-4 block text-3xl font-semibold tracking-tight text-ink">
                {config.contact_email}
              </a>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Use this address for website issues, brand inquiries, or product questions while the broader support surface is still maturing.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-line bg-white/88 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">What to ask here</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <li>Product questions before download</li>
                <li>Brand or partnership introductions</li>
                <li>Website and content corrections</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-line bg-white/88 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why this page stays simple</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Phase one is focused on a strong primary route instead of a sprawling support center, which keeps the site crisp while preserving operational flexibility.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
