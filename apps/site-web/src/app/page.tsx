import { DownloadPanel } from "@/components/sections/download-panel"
import { FAQList } from "@/components/sections/faq-list"
import { FeatureGrid } from "@/components/sections/feature-grid"
import { HeroSection } from "@/components/sections/hero-section"
import { MetricsBand } from "@/components/sections/metrics-band"
import { PostGrid } from "@/components/sections/post-grid"
import { ScenarioStrip } from "@/components/sections/scenario-strip"
import { ShowcasePanel } from "@/components/sections/showcase-panel"
import { getSiteConfig, getSiteDownloadLinks, getSiteFaqs, getSiteFeatures, getSitePosts } from "@/lib/api/site"

export default async function HomePage() {
  const [config, features, faqs, downloads, posts] = await Promise.all([
    getSiteConfig(),
    getSiteFeatures(),
    getSiteFaqs(),
    getSiteDownloadLinks(),
    getSitePosts(1, 2),
  ])

  return (
    <>
      <HeroSection config={config} downloads={downloads} />
      <ScenarioStrip />
      <MetricsBand />
      <ShowcasePanel features={features} />
      <FeatureGrid features={features.slice(0, 4)} />
      <DownloadPanel links={downloads} />
      <FAQList faqs={faqs} compact />
      <PostGrid posts={posts.items} title="Fresh from the DreamAI team" />
    </>
  )
}
