import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "用户协议 | DreamAI",
  description: "DreamAI 用户服务协议 — 使用本服务前请仔细阅读。",
}

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">用户服务协议</h1>
        <p className="mt-4 text-sm text-slate-500">最后更新日期：2026 年 5 月 1 日</p>
      </div>

      <div className="space-y-10 text-sm leading-8 text-slate-700">

        <div className="rounded-[2rem] border border-line bg-white/90 p-8 space-y-4">
          <p>
            欢迎使用 DreamAI。本用户服务协议（以下简称"本协议"）由您与 Dreamlog（以下简称"我们"）共同签订，适用于您使用 DreamAI 应用程序及相关服务（以下统称"本服务"）的全部行为。
          </p>
          <p>
            <strong>请在使用本服务前仔细阅读本协议的全部内容。</strong>当您点击"同意"、完成注册或开始使用本服务时，即表示您已阅读、理解并同意接受本协议的约束。如您不同意本协议的任何条款，请立即停止使用本服务。
          </p>
        </div>

        <Section title="一、服务说明">
          <p>DreamAI 是由 Dreamlog 开发和运营的 AI 视频生成工具，主要功能包括：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>文字生成视频（Text-to-Video）</li>
            <li>图片生成视频（Image-to-Video）</li>
            <li>首尾帧控制视频生成</li>
            <li>AI 动作控制视频生成</li>
            <li>带货电商视频生成</li>
          </ul>
          <p className="mt-4">我们保留在不单独通知您的情况下对服务功能进行调整、更新或扩充的权利，但会尽量通过应用内通知的方式提前告知重大变更。</p>
        </Section>

        <Section title="二、用户资格">
          <ul className="list-disc pl-5 space-y-2">
            <li>您须年满 <strong>17 周岁</strong>方可使用本服务（与 App Store 年龄分级一致）；</li>
            <li>如您是未成年人，须在监护人的监督下使用，并由监护人代为接受本协议；</li>
            <li>您须确保您提供的注册信息真实、准确、完整，并对您账号下的一切行为负责；</li>
            <li>您须遵守您所在国家或地区适用的法律法规。</li>
          </ul>
        </Section>

        <Section title="三、账号注册与管理">
          <SubSection title="3.1 账号创建">
            <p>您可通过手机号码验证码方式注册账号。每个手机号只能注册一个账号。</p>
          </SubSection>
          <SubSection title="3.2 账号安全">
            <p>您有责任妥善保管账号凭证，不得将账号转让、出售或授权他人使用。如发现账号被盗用，应立即通过 support@dreamlog.com 联系我们。因您未妥善保管账号导致的损失由您自行承担。</p>
          </SubSection>
          <SubSection title="3.3 账号注销">
            <p>您可随时在应用内申请注销账号。注销后您的账号数据将在 30 天内被删除，此操作不可逆，未使用的积分和订阅权益将同时清除，不予退还。</p>
          </SubSection>
        </Section>

        <Section title="四、服务使用规范">
          <p>您同意在使用本服务时遵守以下规范，不得利用本服务：</p>

          <SubSection title="4.1 禁止内容">
            <ul className="list-disc pl-5 space-y-2">
              <li>生成、传播涉及色情、暴力、恐怖主义、仇恨言论的内容；</li>
              <li>生成对真实人物（尤其是公众人物）的虚假、误导性或诽谤性内容；</li>
              <li>未经他人授权，将他人肖像用于生成视频（即"AI 换脸"等侵权行为）；</li>
              <li>生成侵犯他人著作权、商标权、专利权或其他知识产权的内容；</li>
              <li>生成违反中国大陆、香港、台湾、美国及您所在地区适用法律的内容。</li>
            </ul>
          </SubSection>

          <SubSection title="4.2 禁止行为">
            <ul className="list-disc pl-5 space-y-2">
              <li>通过技术手段（如爬虫、脚本）大量、自动化地调用本服务；</li>
              <li>试图破解、反编译、逆向工程本应用或后端服务；</li>
              <li>干扰或破坏本服务的正常运行；</li>
              <li>创建或使用虚假账号规避限制或获取不正当利益；</li>
              <li>将本服务的商业许可范围之外的内容用于商业目的。</li>
            </ul>
          </SubSection>

          <p className="mt-4">违反上述规范，我们有权暂停或终止您的账号，情节严重者将依法追究法律责任。</p>
        </Section>

        <Section title="五、内容权属与授权">
          <SubSection title="5.1 您上传的内容">
            <p>您上传到本服务的原始素材（图片、视频等）的知识产权归您所有。您授权我们仅为完成您的生成任务而处理这些素材，不用于其他目的（详见《隐私政策》）。</p>
          </SubSection>
          <SubSection title="5.2 AI 生成结果">
            <p>通过本服务生成的视频内容，在您遵守本协议的前提下，您享有对该内容的使用权，可用于个人创作、分享及商业用途（除本协议禁止的情形外）。</p>
            <p className="mt-2">您理解并同意：AI 生成内容的最终权属认定受不同国家和地区法律管辖的影响，Dreamlog 不对生成内容的版权归属作出任何明确的法律承诺。</p>
          </SubSection>
          <SubSection title="5.3 我们的权利">
            <p>DreamAI 及本服务中的所有技术、算法、界面、商标、品牌形象等均为 Dreamlog 的知识产权，受法律保护。您不得以任何形式复制、仿制或侵犯上述权利。</p>
          </SubSection>
        </Section>

        <Section title="六、收费与退款">
          <SubSection title="6.1 收费方式">
            <p>本服务提供免费功能和付费功能。付费方式包括订阅制和积分包，通过 Apple App Store 完成支付，适用 Apple 的付款政策。</p>
          </SubSection>
          <SubSection title="6.2 订阅自动续期">
            <p>订阅服务将在到期前 24 小时自动续费，除非您在此之前主动取消。您可在 iPhone「设置 → Apple ID → 订阅」中管理或取消订阅。</p>
          </SubSection>
          <SubSection title="6.3 退款政策">
            <p>退款申请须通过 Apple App Store 提交，Dreamlog 不直接处理退款。已使用的积分不予退还。如因本服务的技术故障导致无法使用，我们将酌情予以补偿。</p>
          </SubSection>
        </Section>

        <Section title="七、免责声明">
          <SubSection title="7.1 服务可用性">
            <p>我们将尽力保持服务稳定运行，但不承诺服务不会中断。因以下情形导致的服务中断，我们不承担责任：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>不可抗力（自然灾害、政府行为、网络故障等）；</li>
              <li>系统维护（我们会尽量提前通知）；</li>
              <li>您的设备或网络原因。</li>
            </ul>
          </SubSection>
          <SubSection title="7.2 生成内容">
            <p>AI 生成内容由算法自动产生，我们不保证其准确性、合法性或适用性。您使用生成内容所承担的风险和法律责任由您自行负担。我们建议您在公开发布 AI 生成内容时，遵守相关平台的 AI 内容披露要求。</p>
          </SubSection>
          <SubSection title="7.3 责任限制">
            <p>在适用法律允许的最大范围内，Dreamlog 对因使用本服务产生的间接损失、利润损失、数据损失不承担责任。我们对您的最大赔偿责任不超过您在索赔发生前 12 个月内向我们支付的费用总额。</p>
          </SubSection>
        </Section>

        <Section title="八、服务变更与终止">
          <SubSection title="8.1 我们的权利">
            <p>我们保留在提前通知的情况下修改、暂停或终止部分或全部服务的权利。如涉及付费功能的终止，我们将在合理期限内以积分或其他方式进行补偿。</p>
          </SubSection>
          <SubSection title="8.2 账号封禁">
            <p>如您违反本协议，我们有权在不提前通知的情况下立即封禁您的账号。被封禁账号中未使用的积分将根据违规严重程度决定是否退还。</p>
          </SubSection>
        </Section>

        <Section title="九、协议的变更">
          <p>我们可能因业务调整、法律法规变化等原因更新本协议。重大变更将通过以下方式通知您：</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>应用内弹窗通知，要求您重新确认；</li>
            <li>更新本页面顶部的"最后更新日期"。</li>
          </ul>
          <p className="mt-4">变更生效后继续使用本服务，视为您接受更新后的协议。如您不同意变更内容，请停止使用本服务并申请注销账号。</p>
        </Section>

        <Section title="十、适用法律与争议解决">
          <p>本协议的订立、执行和解释均适用中华人民共和国法律（不包括冲突法规则）。</p>
          <p className="mt-4">如因本协议或本服务产生争议，双方应首先通过友好协商解决。协商不成的，任何一方均可向 Dreamlog 注册地有管辖权的人民法院提起诉讼。</p>
        </Section>

        <Section title="十一、联系我们">
          <p>如您对本协议有任何疑问或需要帮助，请通过以下方式联系我们：</p>
          <div className="mt-4 rounded-[1.5rem] bg-mist px-6 py-5 space-y-2">
            <p><strong>公司名称：</strong>Dreamlog</p>
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
