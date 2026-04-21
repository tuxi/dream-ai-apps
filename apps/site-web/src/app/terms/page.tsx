import { SectionTitle } from "@/components/sections/section-title"

export const metadata = {
  title: "Terms | DreamAI",
}

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionTitle eyebrow="Terms" title="Terms of use placeholder for phase one" description="The legal page is wired into the route structure now and can later be moved into the content API if you want editable rich text management." />
      <div className="mt-8 rounded-[2rem] border border-line bg-white/90 p-8 text-sm leading-8 text-slate-700">
        DreamAI will publish formal terms of use here. The current implementation keeps the page static so the team can ship the brand site without blocking on the admin CMS scope.
      </div>
    </section>
  )
}
