import { FAQList } from "@/components/sections/faq-list"
import { getSiteFaqs } from "@/lib/api/site"

export const metadata = {
  title: "FAQ | DreamAI",
}

export default async function FAQPage() {
  const faqs = await getSiteFaqs()

  return <FAQList faqs={faqs} />
}
