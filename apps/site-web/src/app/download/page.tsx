import { PageHero } from "@/components/sections/page-hero"
import { DownloadPanel } from "@/components/sections/download-panel"
import { getSiteDownloadLinks } from "@/lib/api/site"

export const metadata = {
  title: "Download | DreamAI",
}

export default async function DownloadPage() {
  const links = await getSiteDownloadLinks()

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Download"
        title="Get DreamAI where the product actually lives today"
        description="The website is the front door, but the product experience starts in the app. Phase one keeps the path to download obvious and direct."
        aside={
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Launch focus</p>
            <div className="mt-5 grid gap-3">
              {["App Store conversion", "Product education", "Future platform expansion"].map((item) => (
                <div key={item} className="rounded-[1.25rem] bg-mist px-4 py-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Current platform</p>
            <p className="mt-4 text-2xl font-semibold text-ink">iOS first</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">The current release path is optimized around the App Store experience.</p>
          </div>
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Website role</p>
            <p className="mt-4 text-2xl font-semibold text-ink">Conversion surface</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">The site keeps marketing copy, FAQs, and feature discovery close to the primary CTA.</p>
          </div>
          <div className="rounded-[1.9rem] border border-line bg-white/88 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Future-ready</p>
            <p className="mt-4 text-2xl font-semibold text-ink">More links later</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">The content model already supports additional platforms without redesigning the page.</p>
          </div>
        </div>
      </section>
      <DownloadPanel links={links} />
    </div>
  )
}
