"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { getAdminUsers } from "@/lib/api/admin-console"
import { formatUnixDateTime, formatRoleLabel } from "@/lib/format"
import type { AdminUserListItem, AdminUserListParams } from "@/types/admin"

const defaultFilters: AdminUserListParams = {
  keyword: "",
  page: 1,
  page_size: 20,
}

export function UsersAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [filters, setFilters] = useState<AdminUserListParams>(defaultFilters)
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadUsers(nextFilters = filters) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载用户列表…")
        const response = await getAdminUsers(authToken, nextFilters)
        setUsers(response.items)
        setTotal(response.total)
        updateFeedback(`已加载 ${response.items.length} 条用户数据。`)
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadUsers(defaultFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(240,253,250,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">User operations</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Browse users, inspect account posture, and prepare the surface for role changes, activation controls, and security actions.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={() => loadUsers()}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <section className="rounded-[2rem] border border-line bg-white/90 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Keyword</span>
            <input
              value={filters.keyword || ""}
              onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value, page: 1 }))}
              placeholder="用户名、昵称、手机号或用户 ID"
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              value={String(filters.role ?? "")}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  role: event.target.value ? Number(event.target.value) : undefined,
                  page: 1,
                }))
              }
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="">All roles</option>
              <option value="2">User</option>
              <option value="5090">Admin</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Active Status</span>
            <select
              value={
                filters.is_active === undefined ? "" : filters.is_active ? "active" : "inactive"
              }
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  is_active:
                    event.target.value === ""
                      ? undefined
                      : event.target.value === "active",
                  page: 1,
                }))
              }
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Register Source</span>
            <select
              value={filters.register_source || ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  register_source: event.target.value || undefined,
                  page: 1,
                }))
              }
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="">All sources</option>
              <option value="phone">Phone</option>
              <option value="apple">Apple</option>
              <option value="password">Password</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Page Size</span>
            <select
              value={String(filters.page_size ?? 20)}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  page_size: Number(event.target.value),
                  page: 1,
                }))
              }
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadUsers()}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isPending ? "加载中…" : "查询用户"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters(defaultFilters)
              loadUsers(defaultFilters)
            }}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink"
          >
            重置筛选
          </button>
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-slate-600">Total: {total}</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-line bg-white/92">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-ink">Users</h2>
            <p className="mt-1 text-sm text-slate-600">List view for account operations and later detail entry points.</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="p-6">
            <AdminEmptyState title="No users loaded" description="Apply an admin token and run a query to load the user list." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Auth</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {users.map((user) => (
                  <tr key={user.user_id} className="align-top">
                    <td className="px-6 py-5">
                      <div>
                        <Link href={`/admin/users/${user.user_id}`} className="text-sm font-semibold text-ink transition hover:text-accent">
                          {user.nickname || user.username || `User #${user.user_id}`}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">ID {user.user_id}</p>
                        <p className="mt-2 text-sm text-slate-600">{user.phone_masked || "No phone bound"}</p>
                        {user.register_source ? <p className="mt-1 text-xs text-slate-500">Source: {user.register_source}</p> : null}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <AdminStatusBadge label={user.role_name || formatRoleLabel(user.role)} tone={user.role === 5090 ? "blue" : "slate"} />
                        <AdminStatusBadge label={user.is_active ? "Active" : "Inactive"} tone={user.is_active ? "green" : "rose"} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>Phone: {user.has_phone ? "Yes" : "No"}</p>
                        <p>Apple: {user.has_apple ? "Yes" : "No"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <AdminStatusBadge
                        label={user.subscription_active ? "Subscribed" : "No Subscription"}
                        tone={user.subscription_active ? "green" : "amber"}
                      />
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{user.available_points.toLocaleString()}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <p>{formatUnixDateTime(user.created_at)}</p>
                      <p className="mt-1 text-xs text-slate-500">Updated {formatUnixDateTime(user.updated_at)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
