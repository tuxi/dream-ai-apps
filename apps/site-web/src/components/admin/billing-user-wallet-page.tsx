"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminField, AdminSectionCard } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  adjustAdminBillingUserPoints,
  getAdminBillingUserPointLedgers,
  getAdminBillingUserWallet,
} from "@/lib/api/admin-console"
import { formatUnixDateTime } from "@/lib/format"
import type { AdminBillingWalletResponse, AdminPointLedgerItem } from "@/types/admin"

export function BillingUserWalletPage({ userId }: { userId: number }) {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [wallet, setWallet] = useState<AdminBillingWalletResponse | null>(null)
  const [recentLedgers, setRecentLedgers] = useState<AdminPointLedgerItem[]>([])
  const [points, setPoints] = useState("")
  const [bizId, setBizId] = useState("")
  const [remark, setRemark] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const canSubmitAdjust = useMemo(() => {
    return Number(points) !== 0 && bizId.trim() !== "" && remark.trim() !== ""
  }, [bizId, points, remark])

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadWallet() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载钱包信息…")
        const [walletResponse, ledgersResponse] = await Promise.all([
          getAdminBillingUserWallet(authToken, userId),
          getAdminBillingUserPointLedgers(authToken, userId, { page: 1, page_size: 5 }),
        ])
        setWallet(walletResponse)
        setRecentLedgers(ledgersResponse.items)
        updateFeedback("用户钱包信息已加载。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function adjustPoints() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }
    if (!canSubmitAdjust) {
      updateFeedback("", "请完整填写 points、biz_id 和 remark。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在调整积分…")
        await adjustAdminBillingUserPoints(authToken, userId, {
          points: Number(points),
          biz_id: bizId.trim(),
          remark: remark.trim(),
        })
        const [walletResponse, ledgersResponse] = await Promise.all([
          getAdminBillingUserWallet(authToken, userId),
          getAdminBillingUserPointLedgers(authToken, userId, { page: 1, page_size: 5 }),
        ])
        setWallet(walletResponse)
        setRecentLedgers(ledgersResponse.items)
        setPoints("")
        setBizId("")
        setRemark("")
        updateFeedback("积分调整已完成。")
      } catch (adjustError) {
        updateFeedback("", adjustError instanceof Error ? adjustError.message : "调整失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, userId])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">User wallet</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Review subscription and point entitlements for a specific user, then perform manual point adjustments with an explicit business identifier.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadWallet}
        isBusy={isPending}
        message={message}
        error={error}
      />

      {!wallet ? (
        <AdminEmptyState title="Wallet not loaded" description="Apply an admin token to load the billing wallet and recent point ledger entries." />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            <AdminSectionCard title="Point balance" description="Current point wallet state.">
              <div className="grid gap-3 text-sm text-slate-600">
                <p>Available: {wallet.available_points.toLocaleString()}</p>
                <p>Frozen: {wallet.frozen_points.toLocaleString()}</p>
                <p>Current Period Used: {wallet.current_period_used.toLocaleString()}</p>
                <p>Discount Rate: {wallet.point_discount_rate}</p>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Subscription" description="Current subscription and expiry posture.">
              <div className="grid gap-3 text-sm text-slate-600">
                <div>
                  <AdminStatusBadge label={wallet.subscription_active ? "Active" : "Inactive"} tone={wallet.subscription_active ? "green" : "amber"} />
                </div>
                <p>Plan: {wallet.current_subscription || "None"}</p>
                <p>Expires: {wallet.subscription_expired_at ? formatUnixDateTime(wallet.subscription_expired_at) : "N/A"}</p>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Capabilities" description="Operational view of active billing entitlements.">
              <div className="grid gap-3 text-sm text-slate-600">
                <p>1080P: {wallet.can_use_1080p ? "Yes" : "No"}</p>
                <p>Remove Watermark: {wallet.can_remove_watermark ? "Yes" : "No"}</p>
                <p>Priority Queue: {wallet.can_use_priority_queue ? "Yes" : "No"}</p>
                <p>Custom Aspect: {wallet.can_use_custom_aspect_ratio ? "Yes" : "No"}</p>
                <p>Daily Free Remain: {wallet.daily_free_remain}</p>
                <p>Daily Duration Remain: {wallet.daily_duration_remain_sec}s</p>
              </div>
            </AdminSectionCard>
          </section>

          <AdminSectionCard
            title="Manual point adjustment"
            description="Positive values add points, negative values deduct points. Backend requires a business id and remark."
            action={
              <button
                type="button"
                onClick={adjustPoints}
                disabled={!canSubmitAdjust}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isPending ? "处理中…" : "调整积分"}
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              <AdminField label="Points" value={points} onChange={setPoints} placeholder="例如 100 或 -50" />
              <AdminField label="Biz ID" value={bizId} onChange={setBizId} placeholder="如 admin-adjust-20260421-01" />
              <AdminField label="Remark" value={remark} onChange={setRemark} placeholder="填写本次调整原因" />
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Recent point ledger"
            description="Recent ledger entries for the current user."
            action={
              <Link href={`/admin/billing/users/${userId}/point-ledgers`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
                View Full Ledger
              </Link>
            }
          >
            {recentLedgers.length === 0 ? (
              <AdminEmptyState title="No recent ledgers" description="No point ledger entries were returned for this user." />
            ) : (
              <div className="grid gap-3">
                {recentLedgers.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-line bg-white px-4 py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.display_title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.display_description || item.remark || item.biz_type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <AdminStatusBadge label={item.direction} tone={item.direction === "income" ? "green" : "amber"} />
                        <span className="text-sm font-semibold text-ink">{item.display_points_text}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>Balance After: {item.balance_after}</span>
                      <span>Created: {formatUnixDateTime(item.created_at)}</span>
                      <span>Biz ID: {item.biz_id || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminSectionCard>
        </>
      )}
    </div>
  )
}
