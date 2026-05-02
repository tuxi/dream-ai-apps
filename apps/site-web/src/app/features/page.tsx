import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { FeatureGrid } from "@/components/sections/feature-grid"
import { getSiteFeatures } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Features")
  return {
    title: t("metadata.title"),
  }
}

export default async function FeaturesPage() {
  const features = await getSiteFeatures()

  return (
    <div className="py-8">
      <FeatureGrid features={features} />
    </div>
  )
}
