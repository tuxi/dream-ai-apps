import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy")
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy")

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
          <p><strong>{t("intro.p2_bold")}</strong>{t("intro.p2_rest")}</p>
          <p>{t("intro.p3")}</p>
        </div>

        <Section title="个人信息处理者信息">
          <div className="rounded-[1.5rem] bg-mist px-6 py-5 space-y-2">
            <p><strong>个人信息处理者：</strong>本应用开发者（个人）</p>
            <p><strong>处理目的与方式：</strong>详见本政策第二条"信息的使用目的"</p>
            <p><strong>处理的信息种类：</strong>详见本政策第一条"我们收集的信息"</p>
            <p><strong>保存期限：</strong>详见本政策第六条"数据保留期限"</p>
            <p><strong>个人行使权利的方式：</strong>详见本政策第七条"您的权利"，您可随时通过 support@dreamlog.com 联系我们行使法定权利</p>
          </div>
        </Section>

        <Section title="一、我们收集的信息">
          <SubSection title="1.1 您主动提供的信息">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>账号信息：</strong>当您注册账号时，我们会收集您的手机号码、昵称、头像等基础资料。</li>
              <li><strong>上传内容：</strong>您在使用 AI 视频生成功能时上传的图片、视频素材及文字描述。</li>
              <li><strong>支付信息：</strong>当您购买订阅或积分时，支付行为通过 Apple App Store 处理，我们不直接收集您的银行卡或支付账户信息，但会记录订单编号、交易状态等结果信息。</li>
            </ul>
          </SubSection>

          <SubSection title="1.2 我们自动收集的信息">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>设备信息：</strong>设备型号、操作系统版本、设备唯一标识符（如 IDFA、IDFV）、屏幕分辨率、语言设置。</li>
              <li><strong>网络信息：</strong>IP 地址、网络类型（Wi-Fi / 蜂窝网络）、运营商信息。</li>
              <li><strong>使用数据：</strong>功能使用频率、生成任务记录、点击行为、页面停留时长、崩溃报告及性能数据。</li>
              <li><strong>日志信息：</strong>服务器日志中记录的访问时间、请求内容及错误信息，用于排查问题和改进服务。</li>
            </ul>
          </SubSection>

          <SubSection title="1.3 我们不收集的信息">
            <p>我们不会收集您的位置信息、通讯录、相机或麦克风权限（除非您在具体功能中主动授权），也不会收集与服务无关的任何个人信息。</p>
          </SubSection>
        </Section>

        <Section title="二、信息处理的合法性基础与使用目的">
          <SubSection title="2.1 处理的合法性基础">
            <p>根据《个保法》第十三条，我们基于以下合法性基础处理您的个人信息：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>履行合同所必需：</strong>为向您提供本服务及履行您与我们之间的服务协议，处理您的账号信息、生成任务数据和支付记录；</li>
              <li><strong>取得您的同意：</strong>对于非提供服务所必需的数据处理（如使用情况分析），我们在处理前取得您的授权同意；</li>
              <li><strong>法定义务：</strong>为履行网络安全、财务税务等法律规定的义务所必需的数据处理。</li>
            </ul>
          </SubSection>
          <SubSection title="2.2 信息使用的具体目的">
            <p>我们收集的信息仅用于以下目的：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>提供、维护和改善 DreamAI 的 AI 视频生成服务；</li>
              <li>处理您的 AI 生成任务并返回结果；</li>
              <li>管理您的账号、订阅状态和积分余额；</li>
              <li>向您发送与服务相关的通知（如任务完成、账单提醒）；</li>
              <li>分析产品使用情况，优化用户体验（基于您的同意）；</li>
              <li>检测和防范欺诈、滥用及安全威胁；</li>
              <li>履行法律法规要求的义务。</li>
            </ul>
            <p className="mt-4">我们不会将您的个人信息用于与上述目的无关的其他用途，也不会基于您的信息向您推送与服务无关的广告。</p>
          </SubSection>
        </Section>

        <Section title="三、AI 生成内容与您的数据">
          <SubSection title="3.1 上传素材的处理">
            <p>您上传的图片和视频素材将用于完成您指定的 AI 生成任务。素材处理完成后，我们会按照以下原则管理：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>原始上传素材仅在任务处理期间临时存储，不会用于训练我们的 AI 模型；</li>
              <li>生成结果将在您的账号中保留，以便您随时下载或重新使用；</li>
              <li>您可以随时在应用内删除您的生成历史记录。</li>
            </ul>
          </SubSection>
          <SubSection title="3.2 关于模型训练">
            <p>未经您的明确同意，我们不会使用您上传的个人素材（包含可识别个人身份的图像或内容）来训练或改进我们的 AI 模型。匿名化、聚合后的使用行为数据可能用于模型优化。</p>
          </SubSection>
          <SubSection title="3.3 第三方 AI 服务商">
            <p>本产品的 AI 生成功能由以下已在中国境内完成备案的合规 AI 服务商提供能力支持：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>DeepSeek（深度求索）— 文本生成模型；</li>
              <li>阿里云（通义系列）— 文本/图像生成模型；</li>
              <li>火山引擎（字节跳动）— 视频/图像生成模型；</li>
              <li>可灵 Kling（快手）— 视频生成模型。</li>
            </ul>
            <p className="mt-3">您在使用 AI 生成功能时输入的文字描述、上传的图片素材等内容可能传输至上述服务商进行处理，以完成您指定的生成任务。各服务商均按照中国法律法规完成算法备案，数据处理符合《个人信息保护法》《数据安全法》等法规要求。我们与各服务商的合作协议中均包含数据处理条款，确保您的数据仅用于完成生成任务，不得用于其自身模型的训练或改进。</p>
          </SubSection>
        </Section>

        <Section title="四、信息的共享与披露">
          <p>我们不会将您的个人信息出售给任何第三方。仅在以下情形下，我们会共享您的信息：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>服务提供商：</strong>我们委托阿里云等云计算服务商提供基础设施服务；同时，本产品的 AI 生成能力由 DeepSeek、阿里云通义系列、火山引擎、可灵 Kling 提供，用户输入的图文内容可能传输至上述服务商进行处理。所有服务商均在中国境内完成备案，并在合同约束下处理您的数据，不得将其用于其他目的。</li>
            <li><strong>支付处理：</strong>Apple App Store 负责处理应用内购买，适用 Apple 的隐私政策。</li>
            <li><strong>法律要求：</strong>当法律法规、政府机关或司法机构要求时，我们会依法披露必要信息。</li>
            <li><strong>安全保护：</strong>为保护用户、公众或我们的合法权益，在必要时披露相关信息。</li>
            <li><strong>业务转让：</strong>如发生合并、收购或资产出售，用户数据可能作为资产转移，届时我们将提前通知并确保接收方承担等同的隐私保护义务。</li>
          </ul>
        </Section>

        <Section title="五、数据存储与安全">
          <SubSection title="5.1 数据本地化">
            <p>根据《网络安全法》及《个保法》相关规定，我们在中华人民共和国境内收集和产生的个人信息，将存储在中国境内的服务器上。目前我们使用阿里云（aliyun.com）提供的云计算服务，数据存储于中国大陆境内数据中心。</p>
            <p className="mt-2">如因业务需要确需向境外提供个人信息，我们将根据法律要求取得您的单独同意，并通过国家网信部门组织的安全评估，或与境外接收方订立标准合同等方式确保您的个人信息获得同等保护。</p>
          </SubSection>
          <SubSection title="5.2 安全措施">
            <p>我们采取行业标准的技术和管理措施保护您的个人信息，包括：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>数据传输使用 HTTPS/TLS 加密；</li>
              <li>存储敏感数据时使用加密处理；</li>
              <li>严格控制内部员工对用户数据的访问权限；</li>
              <li>定期进行安全审查和漏洞排查。</li>
            </ul>
            <p className="mt-4">尽管如此，互联网传输和存储无法保证绝对安全。如发生数据安全事件，我们将按照《个保法》第五十七条的规定及时通知主管部门和您。</p>
          </SubSection>
        </Section>

        <Section title="六、数据保留期限">
          <p>我们会在以下期限内保留您的个人信息：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>账号信息：</strong>在您注销账号后 30 天内删除，法律法规要求的特定数据除外；</li>
            <li><strong>生成任务数据：</strong>您可随时在应用内删除，账号注销后自动清除；</li>
            <li><strong>支付记录：</strong>依据财务和税务法规保留至少 5 年；</li>
            <li><strong>安全日志：</strong>保留 6 个月，用于安全审计和问题排查。</li>
          </ul>
        </Section>

        <Section title="七、您的权利">
          <p>您对自己的个人信息享有以下权利：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>访问权：</strong>您可以在应用内查看和导出您的账号信息及生成历史；</li>
            <li><strong>更正权：</strong>您可以在"个人资料"页面修改您的昵称、头像等信息；</li>
            <li><strong>删除权：</strong>您可以随时删除您的生成内容，或申请注销账号以删除全部数据；</li>
            <li><strong>撤回同意权：</strong>您可以随时撤回此前授予的权限（如通知权限），撤回不影响之前基于同意的处理活动的合法性；</li>
            <li><strong>投诉权：</strong>如您认为我们的数据处理违反相关法律，有权向相关监管机构提起投诉。</li>
          </ul>
          <p className="mt-4">如需行使上述权利，请通过 <strong>support@dreamlog.com</strong> 联系我们，我们将在 15 个工作日内响应。</p>
        </Section>

        <Section title="八、未成年人保护">
          <p>本服务面向 17 岁及以上用户。我们不会故意收集 17 岁以下未成年人的个人信息。如果您是未成年人的监护人，并发现其使用了本服务，请通过 <strong>support@dreamlog.com</strong> 联系我们，我们将及时删除相关信息。</p>
        </Section>

        <Section title="九、Cookie 与追踪技术">
          <p>本应用为原生 iOS 应用，不使用 Cookie。官网（dreamlog.com）可能使用以下技术：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>必要性 Cookie：用于维持您的登录状态和基本功能；</li>
            <li>分析工具：用于统计页面访问量和用户行为（如 Google Analytics），数据经匿名化处理。</li>
          </ul>
          <p className="mt-4">您可以通过浏览器设置拒绝非必要 Cookie，但这可能影响官网部分功能的正常使用。</p>
        </Section>

        <Section title="十、隐私政策的变更">
          <p>我们可能根据业务发展或法律要求对本隐私政策进行更新。如发生重大变更，我们将通过以下方式提前通知您：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>在应用内发送通知；</li>
            <li>在本页面顶部更新"最后更新日期"。</li>
          </ul>
          <p className="mt-4">变更生效后继续使用本服务，视为您接受更新后的政策。</p>
        </Section>

        <Section title="十一、联系我们">
          <p>如您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：</p>
          <div className="mt-4 rounded-[1.5rem] bg-mist px-6 py-5 space-y-2">
            <p><strong>开发者：</strong>tuxi</p>
            <p><strong>电子邮件：</strong>support@dreamlog.com</p>
            <p><strong>官网地址：</strong>https://dreamlog.com</p>
          </div>
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
