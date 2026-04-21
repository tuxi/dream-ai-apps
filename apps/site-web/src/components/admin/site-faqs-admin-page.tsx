"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminField, AdminSectionCard, AdminTextarea, AdminToggle } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { createAdminSiteFaq, deleteAdminSiteFaq, getAdminSiteFaqs, type SiteFaqPayload, updateAdminSiteFaq } from "@/lib/api/site-admin"
import type { SiteFaq } from "@/types/site"

const emptyFaq: SiteFaqPayload = {
  question: "",
  answer: "",
  sort: 0,
  is_published: false,
}

export function SiteFaqsAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [faqs, setFaqs] = useState<SiteFaq[]>([])
  const [newFaq, setNewFaq] = useState<SiteFaqPayload>(emptyFaq)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadFaqs() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载 FAQ…")
        const items = await getAdminSiteFaqs(authToken)
        setFaqs(items)
        updateFeedback(`已加载 ${items.length} 条 FAQ。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function createFaq() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在创建 FAQ…")
        const saved = await createAdminSiteFaq(authToken, newFaq)
        setFaqs((current) => [...current, saved].sort((a, b) => a.sort - b.sort))
        setNewFaq(emptyFaq)
        updateFeedback("FAQ 已创建。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "创建失败")
      }
    })
  }

  function saveFaq(item: SiteFaq) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback(`正在保存 FAQ…`)
        const saved = await updateAdminSiteFaq(authToken, item.id, {
          question: item.question,
          answer: item.answer,
          sort: item.sort,
          is_published: item.is_published,
        })
        setFaqs((current) => current.map((faq) => (faq.id === saved.id ? saved : faq)).sort((a, b) => a.sort - b.sort))
        updateFeedback("FAQ 已保存。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  function removeFaq(item: SiteFaq) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "当前管理员会话不存在，请先登录后台。")
      return
    }
    if (!window.confirm(`确认删除 FAQ「${item.question}」吗？`)) {
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在删除 FAQ…")
        await deleteAdminSiteFaq(authToken, item.id)
        setFaqs((current) => current.filter((faq) => faq.id !== item.id))
        updateFeedback("FAQ 已删除。")
      } catch (removeError) {
        updateFeedback("", removeError instanceof Error ? removeError.message : "删除失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadFaqs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(240,253,250,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Site CMS</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">FAQ management</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Manage front-facing FAQs with dedicated ordering and publish state instead of keeping them inside the all-in-one editor.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadFaqs}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Create FAQ"
        description="Add a new FAQ item to the public site knowledge layer."
        action={
          <button type="button" onClick={createFaq} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "新增 FAQ"}
          </button>
        }
      >
        <FaqForm faq={newFaq} onChange={setNewFaq} />
      </AdminSectionCard>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <AdminSectionCard
            key={faq.id}
            title={faq.question}
            description={`Sort: ${faq.sort}`}
            action={
              <div className="flex items-center gap-3">
                <AdminStatusBadge label={faq.is_published ? "Published" : "Draft"} tone={faq.is_published ? "green" : "amber"} />
                <button
                  type="button"
                  onClick={() => removeFaq(faq)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                >
                  删除
                </button>
                <button
                  type="button"
                  onClick={() => saveFaq(faq)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  保存改动
                </button>
              </div>
            }
          >
            <FaqForm
              faq={faq}
              onChange={(nextFaq) => setFaqs((current) => current.map((item) => (item.id === faq.id ? { ...item, ...nextFaq } : item)))}
            />
          </AdminSectionCard>
        ))}
      </div>
    </div>
  )
}

function FaqForm({
  faq,
  onChange,
}: {
  faq: SiteFaqPayload
  onChange: (faq: SiteFaqPayload) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminField label="Question" value={faq.question || ""} onChange={(value) => onChange({ ...faq, question: value })} />
      <AdminField label="Sort" value={String(faq.sort ?? 0)} onChange={(value) => onChange({ ...faq, sort: toNumber(value) })} />
      <AdminToggle label="Published" checked={Boolean(faq.is_published)} onChange={(value) => onChange({ ...faq, is_published: value })} />
      <AdminTextarea label="Answer" value={faq.answer || ""} onChange={(value) => onChange({ ...faq, answer: value })} />
    </div>
  )
}

function toNumber(value: string) {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : 0
}
