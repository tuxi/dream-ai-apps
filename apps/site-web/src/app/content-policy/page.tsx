import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContentPolicy")
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function ContentPolicyPage() {
  const t = await getTranslations("ContentPolicy")

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{t("header.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">{t("header.title")}</h1>
        <p className="mt-4 text-sm text-slate-500">{t("header.lastUpdated")}</p>
      </div>

      <div className="space-y-10 text-sm leading-8 text-slate-700">

        <div className="rounded-[2rem] border border-line bg-white/90 p-8 space-y-4">
          <p>{t("intro.p1")}</p>
        </div>

        <Section title="一、AI 服务商与生成能力">
          <p>
            DreamAI 的 AI 生成功能由以下在中国境内完成备案的合规 AI 服务商提供能力支持。
            用户通过本产品上传的文字描述、图片素材等输入内容，可能传输至对应服务商进行处理。
            各服务商均按照中国法律法规要求完成算法备案，数据处理符合《个人信息保护法》《数据安全法》等法规要求。
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                name: "DeepSeek（深度求索）",
                capability: "文本生成模型",
                model: "【模型名称占位 — 待补充】",
                filing: "【备案号占位 — 待补充】",
              },
              {
                name: "阿里云（通义系列）",
                capability: "文本/图像生成模型",
                model: "【模型名称占位 — 待补充】",
                filing: "【备案号占位 — 待补充】",
              },
              {
                name: "火山引擎（字节跳动）",
                capability: "视频/图像生成模型",
                model: "【模型名称占位 — 待补充】",
                filing: "【备案号占位 — 待补充】",
              },
              {
                name: "可灵 Kling（快手）",
                capability: "视频生成模型",
                model: "【模型名称占位 — 待补充】",
                filing: "【备案号占位 — 待补充】",
              },
            ].map((provider) => (
              <div key={provider.name} className="rounded-[1.25rem] bg-mist px-6 py-4">
                <p className="font-semibold text-ink">
                  {provider.name} — {provider.capability}
                </p>
                <p className="mt-1 text-slate-500">模型：{provider.model}</p>
                <p className="text-slate-500">备案号：{provider.filing}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="二、AI 生成内容标识">
          <p>
            根据国家互联网信息办公室《人工智能生成合成内容标识办法》的要求，本产品对 AI 生成内容采取以下标识措施：
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>
              <strong>显式标识：</strong>
              通过本产品生成的视频内容，在画面中嵌入 AI 生成标识水印或角标，明确告知用户该内容由 AI 生成。
            </li>
            <li>
              <strong>元数据标识：</strong>
              生成内容的文件元数据中将包含 AI 生成标识信息，包括使用的模型名称、生成时间等，便于平台和用户识别。
            </li>
            <li>
              <strong>界面提示：</strong>
              在 AI 生成功能的操作界面中，以显著方式提示用户：本功能使用 AI 技术生成内容，用户应遵守相关法律法规，不得将生成内容用于违法用途。
            </li>
            <li>
              <strong>用户自行标识义务：</strong>
              用户在对外发布或传播 AI 生成内容时，应遵守发布平台的 AI 内容标识要求，主动标识内容的 AI 生成属性，避免误导公众。
            </li>
          </ul>
        </Section>

        <Section title="三、禁止内容清单">
          <p>用户不得利用本产品的 AI 生成功能制作、复制、发布、传播以下内容：</p>

          <SubSection title="3.1 违法违规内容">
            <ul className="list-disc pl-5 space-y-2">
              <li>反对宪法确定的基本原则的内容；</li>
              <li>危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的内容；</li>
              <li>损害国家荣誉和利益的内容；</li>
              <li>煽动民族仇恨、民族歧视，破坏民族团结的内容；</li>
              <li>破坏国家宗教政策，宣扬邪教和封建迷信的内容；</li>
              <li>散布谣言，扰乱社会秩序，破坏社会稳定的内容。</li>
            </ul>
          </SubSection>

          <SubSection title="3.2 色情与暴力内容">
            <ul className="list-disc pl-5 space-y-2">
              <li>任何形式的淫秽、色情、低俗内容；</li>
              <li>涉及性暗示、性挑逗、裸露或性行为描述的内容；</li>
              <li>宣扬暴力、恐怖、极端主义的内容；</li>
              <li>涉及虐待、自残、血腥场景的内容；</li>
              <li>涉及未成年人色情或性剥削的内容（一经发现立即向公安机关报告）。</li>
            </ul>
          </SubSection>

          <SubSection title="3.3 虚假与侵权内容">
            <ul className="list-disc pl-5 space-y-2">
              <li>虚构事实、散布虚假信息、误导公众的内容；</li>
              <li>冒充他人身份或机构的名义生成内容；</li>
              <li>未经授权使用他人肖像（AI 换脸等）、姓名、声音等个人特征生成内容；</li>
              <li>侵犯他人著作权、商标权、专利权、商业秘密等知识产权的内容；</li>
              <li>未经许可使用他人作品（图片、视频、音乐、文字等）作为生成素材。</li>
            </ul>
          </SubSection>

          <SubSection title="3.4 其他禁止内容">
            <ul className="list-disc pl-5 space-y-2">
              <li>涉及赌博、诈骗、传销等违法犯罪活动的内容；</li>
              <li>包含恶意软件、病毒、木马等危害网络安全的内容；</li>
              <li>干扰本产品正常运行的自动化脚本或批量请求；</li>
              <li>其他违反中华人民共和国法律法规的内容。</li>
            </ul>
          </SubSection>
        </Section>

        <Section title="四、用户内容责任">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>用户独立责任：</strong>
              用户通过本产品生成的所有内容，由用户自行承担全部法律责任。
              本产品仅提供 AI 生成工具，不对用户输入内容及生成结果的合法性、准确性、适当性负责。
            </li>
            <li>
              <strong>审核机制：</strong>
              本产品保留对用户输入内容和生成结果进行合规审核的权利。如发现疑似违规内容，
              本产品有权在不事先通知的情况下拒绝处理、删除相关内容，并根据违规严重程度暂停或终止用户账号。
            </li>
            <li>
              <strong>数据留痕：</strong>
              为便于监管部门追溯和审查，用户的 AI 生成请求记录将在一定期限内保留。
              具体保留期限详见《隐私政策》第六条"数据保留期限"。
            </li>
            <li>
              <strong>配合执法：</strong>
              在法律法规、政府机关或司法机构要求时，本产品将依法配合提供相关信息。
            </li>
          </ul>
        </Section>

        <Section title="五、投诉举报渠道">
          <p>
            如您发现任何违反本内容政策的行为或 AI 生成内容，请通过以下方式向我们举报。我们将在收到举报后及时核实和处理：
          </p>
          <div className="mt-4 rounded-[1.5rem] bg-mist px-6 py-5 space-y-2">
            <p><strong>举报邮箱：</strong>support@dreamlog.com</p>
            <p><strong>处理时限：</strong>我们将在收到举报后 7 个工作日内进行核实，并在 15 个工作日内反馈处理结果。</p>
            <p><strong>举报要求：</strong>为便于我们高效处理，请在举报时提供以下信息：</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>涉嫌违规内容的描述或截图；</li>
              <li>内容涉及的页面或功能位置；</li>
              <li>举报人的联系方式（非必需，但有助于我们反馈处理结果）。</li>
            </ul>
          </div>
        </Section>

        <Section title="六、合规声明">
          <p>
            本产品所使用的全部 AI 模型服务商（DeepSeek、阿里云通义系列、火山引擎、可灵 Kling）
            均已按照《互联网信息服务算法推荐管理规定》《互联网信息服务深度合成管理规定》《生成式人工智能服务管理暂行办法》
            等法律法规，在中国境内完成算法备案。
          </p>
          <p className="mt-4">
            本政策将根据法律法规的更新和产品功能的调整适时修订。修订后的政策将在本页面发布，
            重大变更将通过应用内通知或其他适当方式告知用户。
          </p>
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
