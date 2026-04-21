"use client"

import { useEffect, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminSectionCard } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { getAdminBillingUserPointLedgers } from "@/lib/api/admin-console"
import { formatUnixDateTime } from "@/lib/format"
import type { AdminPointLedgerItem } from "@/types/admin"

export function BillingUserPointLedgersPage({ userId }: { userId: number }) {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [items, setItems] = useState<AdminPointLedgerItem[]>([])
  const [total, setTotal] = useState(0)
  const [changeType, setChangeType] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadLedgers(nextChangeType = changeType) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载积分流水…")
        const response = await getAdminBillingUserPointLedgers(authToken, userId, {
          page: 1,
          page_size: 50,
          change_type: nextChangeType || undefined,
        })
        setItems(response.items)
        setTotal(response.total)
        updateFeedback(`已加载 ${response.items.length} 条积分流水。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadLedgers("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, userId])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Point ledger</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Review ledger-level point movement for a single user, including direction, balance after change, business id, and display metadata.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={() => loadLedgers()}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <AdminSectionCard
        title="Filters"
        description="Filter point ledger entries by change type."
        action={
          <button type="button" onClick={() => loadLedgers()} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            {isPending ? "处理中…" : "刷新流水"}
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,18rem)_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Change Type</span>
            <input
              value={changeType}
              onChange={(event) => setChangeType(event.target.value)}
              placeholder="例如 adjust / consume / refund"
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-slate-600">Total: {total}</div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Ledger entries" description="Returned by `/api/v1/admin/billing/users/:id/point-ledgers`.">
        {items.length === 0 ? (
          <AdminEmptyState title="No ledger entries" description="No point ledger entries were returned for this filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">Entry</th>
                  <th className="px-6 py-4">Direction</th>
                  <th className="px-6 py-4">Display</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-ink">{item.change_type}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.biz_type}</p>
                      <p className="mt-1 text-xs text-slate-500">Biz ID: {item.biz_id || "N/A"}</p>
                      {item.remark ? <p className="mt-2 text-sm text-slate-600">{item.remark}</p> : null}
                    </td>
                    <td className="px-6 py-5">
                      <AdminStatusBadge label={item.direction} tone={item.direction === "income" ? "green" : "amber"} />
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-ink">{item.display_title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.display_category}</p>
                      {item.display_description ? <p className="mt-2 text-sm text-slate-600">{item.display_description}</p> : null}
                      <p className="mt-2 text-sm font-semibold text-ink">{item.display_points_text}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <p>After: {item.balance_after}</p>
                      <p className="mt-1">Frozen: {item.frozen_after}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{formatUnixDateTime(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>
    </div>
  )
}
