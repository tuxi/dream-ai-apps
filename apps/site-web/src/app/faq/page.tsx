import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { FAQList } from "@/components/sections/faq-list"
import { getSiteFaqs } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FAQ")
  return {
    title: t("metadata.title"),
  }
}

export default async function FAQPage() {
  const faqs = await getSiteFaqs()

  return <FAQList faqs={faqs} />
}
