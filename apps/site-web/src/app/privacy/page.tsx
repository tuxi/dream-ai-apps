import { SectionTitle } from "@/components/sections/section-title"

export const metadata = {
  title: "Privacy | DreamAI",
}

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionTitle eyebrow="Privacy" title="Privacy policy placeholder for phase one" description="This page is static for now so the website can ship before a fuller content management workflow is introduced." />
      <div className="mt-8 rounded-[2rem] border border-line bg-white/90 p-8 text-sm leading-8 text-slate-700">
        DreamAI will publish formal privacy terms here. In phase one, this page is intentionally static and ready to be replaced by legal content provided by your operations team.
      </div>
    </section>
  )
}
