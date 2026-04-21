import { FeatureGrid } from "@/components/sections/feature-grid"
import { getSiteFeatures } from "@/lib/api/site"

export const metadata = {
  title: "Features | DreamAI",
}

export default async function FeaturesPage() {
  const features = await getSiteFeatures()

  return (
    <div className="py-8">
      <FeatureGrid features={features} />
    </div>
  )
}
