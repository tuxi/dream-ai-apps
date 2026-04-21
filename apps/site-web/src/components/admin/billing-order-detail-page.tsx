"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminSectionCard } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { getAdminBillingOrderDetail } from "@/lib/api/admin-console"
import { formatPriceFen, formatUnixDateTime } from "@/lib/format"
import type { AdminBillingOrderDetailResponse } from "@/types/admin"

function statusTone(status: string) {
  const normalized = status.trim().toLowerCase()

  if (normalized.includes("success") || normalized.includes("paid") || normalized.includes("active") || normalized.includes("published")) {
    return "green" as const
  }
  if (normalized.includes("pending") || normalized.includes("draft")) {
    return "amber" as const
  }
  if (normalized.includes("fail") || normalized.includes("cancel") || normalized.includes("inactive") || normalized.includes("offline")) {
    return "rose" as const
  }
  return "slate" as const
}

function JsonPreview({ value }: { value: Record<string, unknown> | undefined }) {
  if (!value || Object.keys(value).length === 0) {
    return <p className="text-sm text-slate-500">No data returned.</p>
  }

  return (
    <pre className="overflow-x-auto rounded-[1.25rem] bg-slate-950 px-4 py-4 text-xs leading-6 text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

export function BillingOrderDetailPage({ orderId }: { orderId: number }) {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [detail, setDetail] = useState<AdminBillingOrderDetailResponse | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadDetail() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "当前管理员会话不存在，请先登录后台。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载订单详情…")
        const response = await getAdminBillingOrderDetail(authToken, orderId)
        setDetail(response)
        updateFeedback("订单详情已加载。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, orderId])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Billing order detail</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Inspect the full operational context of one billing order, including transaction identifiers, verify result, and backend snapshots.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadDetail}
        isBusy={isPending}
        message={message}
        error={error}
      />

      {!detail ? (
        <AdminEmptyState title="Order detail not loaded" description="Use the current admin session to load this billing order detail." />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            <AdminSectionCard
              title={detail.order_no}
              description={`Order ID ${detail.id}`}
              action={<AdminStatusBadge label={detail.status} tone={statusTone(detail.status)} />}
            >
              <div className="grid gap-3 text-sm text-slate-600">
                <p>User ID: {detail.user_id}</p>
                <p>Amount: {formatPriceFen(detail.amount, detail.currency)}</p>
                <p>Platform: {detail.platform || "N/A"}</p>
                <p>Channel: {detail.channel || "N/A"}</p>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Product" description="Product dimension attached to this order.">
              <div className="grid gap-3 text-sm text-slate-600">
                <p>Product Code: {detail.product_code}</p>
                <p>Product Type: {detail.product_type}</p>
                <p>Refund State: {detail.refund_state || "N/A"}</p>
                <p>Reclaim State: {detail.reclaim_state || "N/A"}</p>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Timestamps" description="Lifecycle timestamps returned by the backend.">
              <div className="grid gap-3 text-sm text-slate-600">
                <p>Created: {formatUnixDateTime(detail.created_at)}</p>
                <p>Purchased: {detail.purchased_at ? formatUnixDateTime(detail.purchased_at) : "N/A"}</p>
                <p>Verified: {detail.verified_at ? formatUnixDateTime(detail.verified_at) : "N/A"}</p>
              </div>
            </AdminSectionCard>
          </section>

          <AdminSectionCard
            title="Transaction context"
            description="Transaction identifiers and verification message."
            action={
              <Link href="/admin/billing/orders" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
                Back to Orders
              </Link>
            }
          >
            <div className="grid gap-3 text-sm text-slate-600">
              <p>Transaction ID: {detail.transaction_id || "N/A"}</p>
              <p>Original Transaction ID: {detail.original_transaction_id || "N/A"}</p>
              <p>Verify Message: {detail.verify_message || "N/A"}</p>
            </div>
          </AdminSectionCard>

          <section className="grid gap-6 xl:grid-cols-2">
            <AdminSectionCard title="User Snapshot" description="Order-level user snapshot returned by backend.">
              <JsonPreview value={detail.user_snapshot} />
            </AdminSectionCard>

            <AdminSectionCard title="Product Snapshot" description="Order-level product snapshot returned by backend.">
              <JsonPreview value={detail.product_snapshot} />
            </AdminSectionCard>
          </section>

          <AdminSectionCard title="Meta" description="Backend meta payload for debugging and operations.">
            <JsonPreview value={detail.meta} />
          </AdminSectionCard>
        </>
      )}
    </div>
  )
}
