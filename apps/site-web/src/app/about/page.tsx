import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/sections/page-hero"

export const metadata: Metadata = {
  title: "关于我们 | DreamAI",
  description: "DreamAI 是由个人开发者打造的 AI 视频生成工具，让每一位创作者和商家都能轻松制作专业视频。",
}

const milestones = [
  {
    label: "产品定位",
    title: "AI 视频生成，人人可用",
    description:
      "DreamAI 专注于降低视频创作的门槛。无论是内容创作者、短视频达人，还是电商商家，都可以通过文字描述、图片或简单的参数设置，在几分钟内生成专业品质的视频。",
  },
  {
    label: "核心能力",
    title: "五大生成模式",
    description:
      "文生视频、图生视频、首尾帧控制、AI 动作控制、带货电商视频——五种模式覆盖创作者和商业场景的核心需求，并在持续迭代中。",
  },
  {
    label: "我们的使命",
    title: "让创意不再被技术拦住",
    description:
      "复杂的视频制作曾经是专业团队的专属能力。DreamAI 相信，当 AI 技术足够易用，每一个有想法的人都能把创意变成视频。",
  },
]

export default function AboutPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="关于我们"
        title="DreamAI，独立开发作品"
        description="我们正在构建一个让 AI 视频生成触手可及的产品——从文字到视频，从创意到画面，一步到位。"
        aside={
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">品牌关系</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.35rem] bg-mist p-4">
                <p className="text-sm font-semibold text-ink">独立开发者</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">产品研发与运营，由个人独立完成。</p>
              </div>
              <div className="rounded-[1.35rem] bg-white p-4 ring-1 ring-line">
                <p className="text-sm font-semibold text-ink">DreamAI</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">产品名称，App Store 上架应用。</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {milestones.map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-line bg-white/90 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{item.label}</p>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2.2rem] bg-[linear-gradient(145deg,#102033,#17395d,#0f766e)] p-10 text-white shadow-float">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">联系我们</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">有想法？欢迎告诉我们。</h2>
            <p className="mt-5 text-sm leading-8 text-white/74">
              无论是产品反馈、合作咨询，还是使用中遇到的问题，都可以通过邮件联系我们。我们会认真对待每一封来信。
            </p>
            <a
              href="mailto:support@dreamlog.com"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              support@dreamlog.com
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-line bg-white/90 p-8">
          <h2 className="text-lg font-semibold text-ink mb-5">备案公示</h2>
          <div className="grid gap-4 text-sm leading-7 text-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">运营者</p>
              <p className="mt-1 font-semibold">tuxi</p>
              <p className="mt-0.5 text-slate-500">DreamAI 产品开发与运营</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">GitHub</p>
              <p className="mt-1">
                <a
                  href="https://github.com/tuxi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent"
                >
                  github.com/tuxi
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ICP 备案号</p>
              <p className="mt-1">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent"
                >
                  京ICP备19030687号
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">联系邮箱</p>
              <p className="mt-1">
                <a href="mailto:support@dreamlog.com" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">
                  support@dreamlog.com
                </a>
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">法定文书</p>
              <p className="mt-1 flex gap-3">
                <Link href="/privacy" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">隐私政策</Link>
                <Link href="/terms" className="font-semibold text-ink underline underline-offset-2 transition hover:text-accent">用户协议</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
