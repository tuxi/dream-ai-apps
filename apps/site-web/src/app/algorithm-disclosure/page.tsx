import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AlgorithmDisclosure")
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function AlgorithmDisclosurePage() {
  const t = await getTranslations("AlgorithmDisclosure")

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{t("header.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">{t("header.title")}</h1>
        <p className="mt-4 text-sm text-slate-500">{t("header.lastUpdated")}</p>
      </div>

      <div className="prose-policy space-y-10 text-sm leading-8 text-slate-700">

        <div className="rounded-[2rem] border border-line bg-white/90 p-8 space-y-4">
          <p>{t("intro.p1")}</p>
        </div>

        <Section title={t("section1.title")}>
          <p className="mb-4">{t("section1.description")}</p>

          <SubSection title={t("section1.item1.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item1.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item1.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item1.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item1.provider")}</li>
            </ul>
          </SubSection>

          <SubSection title={t("section1.item2.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item2.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item2.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item2.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item2.provider")}</li>
            </ul>
          </SubSection>

          <SubSection title={t("section1.item3.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item3.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item3.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item3.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item3.provider")}</li>
            </ul>
          </SubSection>

          <SubSection title={t("section1.item4.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item4.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item4.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item4.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item4.provider")}</li>
            </ul>
          </SubSection>

          <SubSection title={t("section1.item5.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item5.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item5.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item5.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item5.provider")}</li>
            </ul>
          </SubSection>

          <SubSection title={t("section1.item6.name")}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t("section1.label.name")}：</strong>{t("section1.item6.algorithm_name")}</li>
              <li><strong>{t("section1.label.record_no")}：</strong>{t("section1.item6.record_no")}</li>
              <li><strong>{t("section1.label.type")}：</strong>{t("section1.item6.type")}</li>
              <li><strong>{t("section1.label.provider")}：</strong>{t("section1.item6.provider")}</li>
            </ul>
          </SubSection>
        </Section>

        <Section title={t("section2.title")}>
          <p>{t("section2.description")}</p>

          <SubSection title={t("section2.item1.name")}>
            <p>{t("section2.item1.text")}</p>
          </SubSection>

          <SubSection title={t("section2.item2.name")}>
            <p>{t("section2.item2.text")}</p>
          </SubSection>

          <SubSection title={t("section2.item3.name")}>
            <p>{t("section2.item3.text")}</p>
          </SubSection>

          <SubSection title={t("section2.item4.name")}>
            <p>{t("section2.item4.text")}</p>
          </SubSection>

          <SubSection title={t("section2.item5.name")}>
            <p>{t("section2.item5.text")}</p>
          </SubSection>

          <SubSection title={t("section2.item6.name")}>
            <p>{t("section2.item6.text")}</p>
          </SubSection>
        </Section>

        <Section title={t("section3.title")}>
          <p className="mb-4">{t("section3.description")}</p>

          <SubSection title={t("section3.item1.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item1.step1")}</li>
              <li>{t("section3.item1.step2")}</li>
              <li>{t("section3.item1.step3")}</li>
              <li>{t("section3.item1.step4")}</li>
            </ol>
          </SubSection>

          <SubSection title={t("section3.item2.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item2.step1")}</li>
              <li>{t("section3.item2.step2")}</li>
              <li>{t("section3.item2.step3")}</li>
              <li>{t("section3.item2.step4")}</li>
            </ol>
          </SubSection>

          <SubSection title={t("section3.item3.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item3.step1")}</li>
              <li>{t("section3.item3.step2")}</li>
              <li>{t("section3.item3.step3")}</li>
              <li>{t("section3.item3.step4")}</li>
            </ol>
          </SubSection>

          <SubSection title={t("section3.item4.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item4.step1")}</li>
              <li>{t("section3.item4.step2")}</li>
              <li>{t("section3.item4.step3")}</li>
              <li>{t("section3.item4.step4")}</li>
            </ol>
          </SubSection>

          <SubSection title={t("section3.item5.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item5.step1")}</li>
              <li>{t("section3.item5.step2")}</li>
              <li>{t("section3.item5.step3")}</li>
              <li>{t("section3.item5.step4")}</li>
            </ol>
          </SubSection>

          <SubSection title={t("section3.item6.name")}>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("section3.item6.step1")}</li>
              <li>{t("section3.item6.step2")}</li>
              <li>{t("section3.item6.step3")}</li>
              <li>{t("section3.item6.step4")}</li>
            </ol>
          </SubSection>
        </Section>

        <Section title={t("section4.title")}>
          <p>{t("section4.description")}</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>{t("section4.item1")}</li>
            <li>{t("section4.item2")}</li>
            <li>{t("section4.item3")}</li>
            <li>{t("section4.item4")}</li>
            <li>{t("section4.item5")}</li>
            <li>{t("section4.item6")}</li>
          </ul>
        </Section>

        <Section title={t("section5.title")}>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("section5.item1")}</li>
            <li>{t("section5.item2")}</li>
            <li>{t("section5.item3")}</li>
            <li>{t("section5.item4")}</li>
            <li>{t("section5.item5")}</li>
          </ul>
        </Section>

        <Section title={t("section6.title")}>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("section6.item1")}</li>
            <li>{t("section6.item2")}</li>
            <li>{t("section6.item3")}</li>
            <li>{t("section6.item4")}</li>
          </ul>
        </Section>

        <Section title={t("section7.title")}>
          <p className="mb-4">{t("section7.p1")}</p>
          <p>{t("section7.p2")}</p>
        </Section>

      </div>
    </section>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-line bg-white/90 p-8">
      <h2 className="text-lg font-semibold text-ink mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-ink">{title}</h3>
      {children}
    </div>
  )
}
