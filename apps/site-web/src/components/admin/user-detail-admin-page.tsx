"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminField, AdminSectionCard } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  activateAdminUser,
  deactivateAdminUser,
  forceLogoutAdminUser,
  getAdminUserDetail,
  getAdminUserDevices,
  promoteAdminUser,
  revokeAdminUser,
  unbindAppleAdminUser,
  updateAdminUserProfile,
} from "@/lib/api/admin-console"
import { formatRoleLabel, formatUnixDateTime } from "@/lib/format"
import type { AdminUserDetailResponse, AdminUserDeviceItem } from "@/types/admin"

export function UserDetailAdminPage({ userId }: { userId: number }) {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [detail, setDetail] = useState<AdminUserDetailResponse | null>(null)
  const [devices, setDevices] = useState<AdminUserDeviceItem[]>([])
  const [nickname, setNickname] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function syncEditableFields(nextDetail: AdminUserDetailResponse | null) {
    setNickname(nextDetail?.basic.nickname || "")
    setAvatarUrl(nextDetail?.basic.avatar_url || "")
  }

  function loadUser() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载用户详情…")
        const [userDetail, userDevices] = await Promise.all([
          getAdminUserDetail(authToken, userId),
          getAdminUserDevices(authToken, userId),
        ])
        setDetail(userDetail)
        setDevices(userDevices.items)
        syncEditableFields(userDetail)
        updateFeedback("用户详情已加载。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  async function runAction(action: (token: string) => Promise<unknown>, successMessage: string) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在执行操作…")
        await action(authToken)
        await Promise.all([
          getAdminUserDetail(authToken, userId).then((userDetail) => {
            setDetail(userDetail)
            syncEditableFields(userDetail)
          }),
          getAdminUserDevices(authToken, userId).then((userDevices) => {
            setDevices(userDevices.items)
          }),
        ])
        updateFeedback(successMessage)
      } catch (actionError) {
        updateFeedback("", actionError instanceof Error ? actionError.message : "操作失败")
      }
    })
  }

  function saveProfile() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在保存资料…")
        const saved = await updateAdminUserProfile(authToken, userId, {
          nickname,
          avatar_url: avatarUrl,
        })
        setDetail(saved)
        syncEditableFields(saved)
        updateFeedback("用户资料已保存。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, userId])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(240,253,250,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">User detail</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Inspect account posture, linked auth methods, wallet summary, devices, and perform basic operational actions for a specific user.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={loadUser}
        isBusy={isPending}
        message={message}
        error={error}
      />

      {!detail ? (
        <AdminEmptyState title="User detail not loaded" description="Apply an admin token to load this user detail page." />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
            <AdminSectionCard
              title={detail.basic.nickname || detail.basic.username || `User #${detail.basic.user_id}`}
              description={`User ID ${detail.basic.user_id}`}
              action={
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge label={detail.basic.role_name || formatRoleLabel(detail.basic.role)} tone={detail.basic.role === 5090 ? "blue" : "slate"} />
                  <AdminStatusBadge label={detail.basic.is_active ? "Active" : "Inactive"} tone={detail.basic.is_active ? "green" : "rose"} />
                </div>
              }
            >
              <div className="grid gap-3 text-sm text-slate-600">
                <p>Username: {detail.basic.username || "N/A"}</p>
                <p>Phone: {detail.basic.phone_masked || "Not bound"}</p>
                <p>Email: {detail.basic.email_masked || "Not bound"}</p>
                <p>Created: {formatUnixDateTime(detail.basic.created_at)}</p>
                <p>Updated: {formatUnixDateTime(detail.basic.updated_at)}</p>
              </div>
            </AdminSectionCard>

          <AdminSectionCard title="Auth and billing" description="Snapshot of login posture and wallet state.">
              <div className="grid gap-3 text-sm text-slate-600">
                <p>Register Source: {detail.auth.register_source || "Unknown"}</p>
                <p>Bound Methods: {detail.auth.bound_login_methods.length ? detail.auth.bound_login_methods.join(", ") : "None"}</p>
                <p>Preferred Method: {detail.auth.preferred_login_method || "N/A"}</p>
                <p>Subscription: {detail.billing.subscription_active ? detail.billing.current_subscription || "Active" : "Inactive"}</p>
                <p>Available Points: {detail.billing.available_points.toLocaleString()}</p>
                <p>Frozen Points: {detail.billing.frozen_points.toLocaleString()}</p>
                <p>Discount Rate: {detail.billing.point_discount_rate}</p>
                <div className="pt-2">
                  <Link
                    href={`/admin/billing/users/${userId}/wallet`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                  >
                    Open Billing Wallet
                  </Link>
                </div>
              </div>
            </AdminSectionCard>
          </section>

          <AdminSectionCard
            title="Editable profile"
            description="Update nickname or avatar URL using the admin profile endpoint."
            action={
              <button type="button" onClick={saveProfile} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
                {isPending ? "处理中…" : "保存资料"}
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Nickname" value={nickname} onChange={setNickname} />
              <AdminField label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="User actions" description="Operational account actions based on currently available backend endpoints.">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => runAction((authToken) => activateAdminUser(authToken, userId), "用户已启用。")}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Activate
              </button>
              <button
                type="button"
                onClick={() => runAction((authToken) => deactivateAdminUser(authToken, userId), "用户已停用并强制下线。")}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Deactivate
              </button>
              <button
                type="button"
                onClick={() => runAction((authToken) => promoteAdminUser(authToken, userId), "用户已提升为管理员。")}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Promote Admin
              </button>
              <button
                type="button"
                onClick={() => runAction((authToken) => revokeAdminUser(authToken, userId), "管理员权限已撤销。")}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Revoke Admin
              </button>
              <button
                type="button"
                onClick={() => runAction((authToken) => forceLogoutAdminUser(authToken, userId), "已执行强制下线。")}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Force Logout
              </button>
              {detail.security.can_unbind_apple ? (
                <button
                  type="button"
                  onClick={() => runAction((authToken) => unbindAppleAdminUser(authToken, userId), "Apple 绑定已解除。")}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  Unbind Apple
                </button>
              ) : null}
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Devices" description="Recent devices associated with this account.">
            {devices.length === 0 ? (
              <AdminEmptyState title="No devices returned" description="This account has no device entries or the backend returned an empty list." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-line">
                  <thead className="bg-slate-50/80">
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      <th className="px-6 py-4">Device</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">System</th>
                      <th className="px-6 py-4">Last Login</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {devices.map((device) => (
                      <tr key={device.id}>
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-ink">{device.device_name || device.device_id}</p>
                          <p className="mt-1 text-xs text-slate-500">{device.device_id}</p>
                          {device.last_login_ip ? <p className="mt-2 text-xs text-slate-500">IP {device.last_login_ip}</p> : null}
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700">{device.device_type}</td>
                        <td className="px-6 py-5 text-sm text-slate-700">
                          <p>{device.os || "Unknown OS"}</p>
                          <p className="mt-1 text-xs text-slate-500">{device.app_version || "Unknown version"}</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">{formatUnixDateTime(device.last_login_at)}</td>
                        <td className="px-6 py-5">
                          <AdminStatusBadge label={device.is_blocked ? "Blocked" : "Normal"} tone={device.is_blocked ? "rose" : "green"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminSectionCard>
        </>
      )}
    </div>
  )
}
