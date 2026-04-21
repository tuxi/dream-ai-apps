"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import { getAdminBillingOrders, getAdminBillingProducts } from "@/lib/api/admin-console"
import { formatPriceFen, formatUnixDateTime } from "@/lib/format"
import type {
  AdminBillingOrderItem,
  AdminBillingOrderListParams,
  AdminBillingProductItem,
} from "@/types/admin"

const defaultFilters: AdminBillingOrderListParams = {
  page: 1,
  page_size: 20,
}

export function BillingAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [filters, setFilters] = useState<AdminBillingOrderListParams>(defaultFilters)
  const [orders, setOrders] = useState<AdminBillingOrderItem[]>([])
  const [products, setProducts] = useState<AdminBillingProductItem[]>([])
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadBilling(nextFilters = filters) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载订单与产品数据…")
        const [ordersResponse, productsResponse] = await Promise.all([
          getAdminBillingOrders(authToken, nextFilters),
          getAdminBillingProducts(authToken),
        ])
        setOrders(ordersResponse.items)
        setTotal(ordersResponse.total)
        setProducts(productsResponse.items)
        updateFeedback("Billing 数据已刷新。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadBilling(defaultFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Billing operations</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Monitor payment orders, review product configuration, and prepare the workflow for wallet support and manual point adjustments.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={() => loadBilling()}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <section className="rounded-[2rem] border border-line bg-white/90 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">User ID</span>
            <input
              value={filters.user_id ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  user_id: event.target.value ? Number(event.target.value) : undefined,
                  page: 1,
                }))
              }
              placeholder="Filter by user"
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order Status</span>
            <input
              value={filters.status || ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value || undefined,
                  page: 1,
                }))
              }
              placeholder="e.g. paid / pending"
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Product Type</span>
            <input
              value={filters.product_type || ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  product_type: event.target.value || undefined,
                  page: 1,
                }))
              }
              placeholder="subscription / points"
              className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
            />
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
            onClick={() => loadBilling()}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isPending ? "加载中…" : "查询 Billing"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters(defaultFilters)
              loadBilling(defaultFilters)
            }}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink"
          >
            重置筛选
          </button>
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-slate-600">Orders: {total}</div>
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-slate-600">Products: {products.length}</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-line bg-white/92">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-ink">Orders</h2>
            <p className="mt-1 text-sm text-slate-600">Operational payment list across products, platforms, and verification states.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-6">
            <AdminEmptyState title="No orders loaded" description="Apply an admin token and query billing orders to load the list." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Timestamps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="px-6 py-5">
                      <Link href={`/admin/billing/orders/${order.id}`} className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
                        {order.order_no}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">Order ID {order.id}</p>
                      {order.transaction_id ? <p className="mt-2 text-xs text-slate-500">TX {order.transaction_id}</p> : null}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{order.user_id}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-ink">{order.product_code}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.product_type} via {order.platform || "unknown"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{order.channel || "No channel"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <AdminStatusBadge label={order.status} tone={statusTone(order.status)} />
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{formatPriceFen(order.amount, order.currency)}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <p>Created {formatUnixDateTime(order.created_at)}</p>
                      {order.purchased_at ? <p className="mt-1">Purchased {formatUnixDateTime(order.purchased_at)}</p> : null}
                      {order.verified_at ? <p className="mt-1">Verified {formatUnixDateTime(order.verified_at)}</p> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-line bg-white/92">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-ink">Products</h2>
            <p className="mt-1 text-sm text-slate-600">Current billing products configured for subscription and point-pack flows.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-6">
            <AdminEmptyState title="No products loaded" description="The product list will appear here once billing products are returned by the backend." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="align-top">
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-ink">{product.display_name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.product_code}</p>
                      {product.description ? <p className="mt-2 text-sm text-slate-600">{product.description}</p> : null}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      <p>{product.product_type}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.platform}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      <p>{formatPriceFen(product.price_amount, product.currency)}</p>
                      {product.period_unit ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {product.period_count} {product.period_unit}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{product.point_amount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <AdminStatusBadge label={product.status} tone={statusTone(product.status)} />
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <p>{formatUnixDateTime(product.updated_at)}</p>
                      <p className="mt-1 text-xs text-slate-500">Sort {product.sort}</p>
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
