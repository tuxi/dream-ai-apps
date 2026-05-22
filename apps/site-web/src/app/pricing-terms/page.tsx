import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PricingTerms")
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function PricingTermsPage() {
  const t = await getTranslations("PricingTerms")

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
          《DreamAI 付费服务协议》
        </h1>
        <p className="mt-2 text-sm text-slate-500">含《自动续费服务规则》</p>
        <p className="mt-4 text-sm text-slate-500">最后更新日期：2026 年 5 月 22 日</p>
      </div>

      <div className="space-y-10 text-sm leading-8 text-slate-700">

        <div className="rounded-[2rem] border border-line bg-white/90 p-8 space-y-4">
          <p>欢迎使用 DreamAI（中文名称：梦境AI）提供的付费服务。</p>
          <p>为了保障您的权益，请您在购买、订阅或使用 DreamAI 相关付费服务前，仔细阅读并充分理解本协议全部内容，<strong>特别是加粗部分</strong>。</p>
          <p>您一旦购买、开通、订阅或使用 DreamAI 的付费服务，即视为您已经阅读、理解并同意接受本协议全部内容。</p>
          <p>如您未满 18 周岁，请在法定监护人的陪同或同意下使用本服务。</p>
        </div>

        <Section title="第一条 协议说明">
          <SubSection title="1.1 协议范围">
            <p>本协议是您与 DreamAI 提供商之间关于 DreamAI 付费服务、自动续费服务及点数（Credits）服务所订立的协议。</p>
            <p className="mt-2">本协议与《用户服务协议》《隐私政策》以及 DreamAI 已发布或未来可能发布的相关规则共同构成完整协议内容。</p>
          </SubSection>
          <SubSection title="1.2 协议更新">
            <p>DreamAI 有权根据业务发展、产品调整或法律法规要求，对本协议进行更新。</p>
            <p className="mt-2">更新后的协议将在 App 内或官方网站公示。若您继续使用相关服务，则视为您接受更新后的协议内容。</p>
          </SubSection>
        </Section>

        <Section title="第二条 服务说明">
          <SubSection title="2.1 服务内容">
            <p>DreamAI 是一款基于人工智能技术的创作工具，用户可通过点数（Credits）使用包括但不限于：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>AI 视频生成</li>
              <li>AI 图片生成</li>
              <li>AI 图生视频</li>
              <li>AI 带货视频生成</li>
              <li>Timeline 视频编排</li>
              <li>高清导出</li>
              <li>高级模型生成</li>
              <li>AI 创意生成等功能</li>
            </ul>
            <p className="mt-3">具体功能以 App 实际展示为准。</p>
          </SubSection>
          <SubSection title="2.2 点数（Credits）说明">
            <p>"点数（Credits）"是 DreamAI 提供的虚拟消耗额度，用于支付 AI 生成、渲染、推理、视频处理等服务成本。</p>
            <p className="mt-2"><strong>点数不属于货币、预付款、证券、代币或其他金融资产，不具备法定货币价值，不可提现、不可转让、不可赠送、不可交易。</strong></p>
            <p className="mt-2">除法律法规另有规定外，点数一经消耗，不支持退款或兑换现金。</p>
          </SubSection>
          <SubSection title="2.3 会员服务说明">
            <p>DreamAI 提供周会员、月会员、年会员等订阅服务。</p>
            <p className="mt-2">会员权益用于解锁更高阶能力、更少限制和更好的生成体验，但所有 AI 生成任务仍会正常消耗点数。</p>
            <p className="mt-2">当前会员权益可能包括：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>去除 DreamAI 水印</li>
              <li>解锁 1080P 高清生成</li>
              <li>高清图片生成</li>
              <li>优先任务队列</li>
              <li>点数包折扣</li>
              <li>高级生成能力</li>
              <li>更高任务限制</li>
            </ul>
            <p className="mt-3">具体权益以 App 内实际展示为准。</p>
          </SubSection>
        </Section>

        <Section title="第三条 自动续费服务规则">
          <SubSection title="3.1 自动续费说明">
            <p>自动续费服务是在您已开通会员订阅服务的前提下，为避免因订阅到期导致服务中断而推出的自动续费功能。</p>
          </SubSection>
          <SubSection title="3.2 Apple App Store 自动续费">
            <p>DreamAI 当前仅支持通过 Apple App Store 内购订阅。</p>
            <p className="mt-2">如果您通过 Apple ID 开通自动续费服务，则 Apple 将会在<strong>当前订阅周期到期前 24 小时内</strong>自动从您的 Apple ID 账户扣除下一周期费用。</p>
            <p className="mt-2">扣费成功后，会员有效期将自动延长对应周期。</p>
          </SubSection>
          <SubSection title="3.3 自动续费取消方式">
            <p>您可以在当前订阅周期结束前至少 24 小时，通过 iOS 系统设置取消自动续费：</p>
            <p className="mt-2">"设置" → Apple ID → "订阅" → DreamAI → 取消订阅</p>
            <p className="mt-2"><strong>若未在到期前至少 24 小时取消，则系统将自动续费。</strong></p>
          </SubSection>
          <SubSection title="3.4 关于退款">
            <p>Apple 内购订单及订阅退款由 Apple 官方统一处理。</p>
            <p className="mt-2">您可以通过 Apple 官方渠道申请退款，DreamAI 无法直接处理 Apple 内购退款。</p>
          </SubSection>
        </Section>

        <Section title="第四条 点数规则说明">
          <SubSection title="4.1 点数来源">
            <p>DreamAI 点数可能通过以下方式获得：</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-2 pr-4 font-semibold">来源</th>
                    <th className="py-2 font-semibold">说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">点数包购买</td>
                    <td className="py-2">通过 App Store 购买</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">会员赠点</td>
                    <td className="py-2">开通或续订会员后发放</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SubSection>
          <SubSection title="4.2 点数有效期">
            <p><strong>（1）会员赠送点数</strong></p>
            <p className="mt-2">会员赠送点数的有效期与当前订阅账期绑定：</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-2 pr-4 font-semibold">会员类型</th>
                    <th className="py-2 pr-4 font-semibold">赠送点数</th>
                    <th className="py-2 font-semibold">有效期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">周会员</td>
                    <td className="py-2 pr-4">360 点</td>
                    <td className="py-2">当前账期结束（约 7 天）</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">月会员</td>
                    <td className="py-2 pr-4">1500 点</td>
                    <td className="py-2">当前账期结束（约 1 个月）</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">年会员</td>
                    <td className="py-2 pr-4">12000 点</td>
                    <td className="py-2">当前账期结束（约 1 年）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">如 Apple 返回的订阅到期时间存在，则以 Apple 实际返回时间为准。</p>
            <p className="mt-2">当前账期结束后，未使用的会员赠送点数可能失效。</p>
            <p className="mt-4"><strong>（2）点数包购买点数</strong></p>
            <p className="mt-2">通过购买点数包获得的点数有效期为自到账之日起 1 年。</p>
            <p className="mt-4"><strong>（3）活动奖励点数</strong></p>
            <p className="mt-2">活动赠送点数的有效期以活动页面说明为准。</p>
          </SubSection>
        </Section>

        <Section title="第五条 点数使用规则">
          <SubSection title="5.1 点数用途">
            <p>点数用于支付 AI 模型推理、生成和渲染成本。</p>
            <p className="mt-2">当前包括但不限于：</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-2 pr-4 font-semibold">功能</th>
                    <th className="py-2 font-semibold">说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">视频生成</td>
                    <td className="py-2">按秒扣点</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">图片生成</td>
                    <td className="py-2">按张扣点</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">图生视频</td>
                    <td className="py-2">按生成任务扣点</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">Timeline 视频生成</td>
                    <td className="py-2">按生成时长扣点</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">高清生成</td>
                    <td className="py-2">可能增加额外点数消耗</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 pr-4">高级模型</td>
                    <td className="py-2">可能增加额外点数消耗</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">具体扣点规则以 App 实际展示为准。</p>
          </SubSection>
          <SubSection title="5.2 任务扣费规则">
            <p>DreamAI 采用"冻结 → 执行 → 结算"模式：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>创建任务时，系统可能预冻结对应点数；</li>
              <li>任务成功后正式扣除；</li>
              <li>任务失败、取消或异常终止时，系统可能退还或解冻未实际消耗点数。</li>
            </ul>
          </SubSection>
          <SubSection title="5.3 点数消耗顺序">
            <p>系统会优先消耗剩余有效期较短的点数。</p>
          </SubSection>
          <SubSection title="5.4 点数限制">
            <p>点数仅限当前账号使用。</p>
            <p className="mt-2">您不得通过出售、转让、出租、共享、外挂、破解等方式非法获取或使用点数。</p>
          </SubSection>
        </Section>

        <Section title="第六条 AI 生成服务特别说明">
          <SubSection title="6.1 AI 生成结果说明">
            <p>DreamAI 基于人工智能模型生成内容。</p>
            <p className="mt-2">由于 AI 技术本身存在不确定性，生成结果可能受到以下因素影响：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>输入内容</li>
              <li>模型能力</li>
              <li>第三方 AI 服务稳定性</li>
              <li>网络环境</li>
              <li>推理参数</li>
              <li>素材质量</li>
            </ul>
            <p className="mt-3">DreamAI 不保证生成结果完全符合您的预期。</p>
          </SubSection>
          <SubSection title="6.2 关于生成失败">
            <p>因模型异常、网络波动、第三方服务异常或不可抗力等原因导致任务失败时，DreamAI 有权根据实际情况：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>重新执行任务；</li>
              <li>退还部分或全部点数；</li>
              <li>中止任务。</li>
            </ul>
          </SubSection>
          <SubSection title="6.3 内容合规责任">
            <p>您应确保上传、生成、发布的内容合法合规，并拥有必要授权。</p>
            <p className="mt-2">禁止上传或生成包括但不限于：</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>侵权内容</li>
              <li>色情低俗内容</li>
              <li>违法违规内容</li>
              <li>暴力恐怖内容</li>
              <li>虚假诈骗内容</li>
              <li>侵犯他人隐私内容</li>
            </ul>
            <p className="mt-3">DreamAI 有权对违规内容进行删除、限制、封禁或终止服务。</p>
          </SubSection>
        </Section>

        <Section title="第七条 服务中止与终止">
          <p>在以下情况下，DreamAI 有权暂停、中断或终止服务：</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>用户违反法律法规；</li>
            <li>用户违反本协议；</li>
            <li>用户恶意攻击、破解或滥用服务；</li>
            <li>存在风险行为；</li>
            <li>Apple 政策要求；</li>
            <li>第三方服务不可用；</li>
            <li>不可抗力因素。</li>
          </ul>
        </Section>

        <Section title="第八条 法律适用与争议解决">
          <p>本协议适用中华人民共和国法律。</p>
          <p className="mt-2">如发生争议，双方应优先协商解决；协商不成的，任何一方可向 DreamAI 提供商所在地有管辖权的人民法院提起诉讼。</p>
        </Section>

        <Section title="第九条 联系方式">
          <p>官方网站：</p>
          <p className="mt-2">
            <a href="https://dreamlog.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">https://dreamlog.com</a>
          </p>
          <p className="mt-2">客服邮箱：<a href="mailto:support@dreamlog.com" className="text-accent underline underline-offset-2">support@dreamlog.com</a></p>
          <p className="mt-4">如您对本协议有任何疑问，可通过以上方式联系 DreamAI。</p>
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
