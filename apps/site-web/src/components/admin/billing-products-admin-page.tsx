"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, useTransition } from "react"

import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminField, AdminSectionCard, AdminTextarea } from "@/components/admin/admin-form-controls"
import { AdminSessionPanel } from "@/components/admin/admin-session-panel"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { useAdminToken } from "@/components/admin/use-admin-token"
import {
  createAdminBillingProduct,
  getAdminBillingProducts,
  updateAdminBillingProduct,
} from "@/lib/api/admin-console"
import { formatPriceFen, formatUnixDateTime } from "@/lib/format"
import type { AdminBillingProductItem, AdminUpsertBillingProductPayload } from "@/types/admin"

type ProductFormState = {
  id: number | null
  product_code: string
  product_type: string
  platform: string
  display_name: string
  description: string
  status: string
  price_amount: string
  currency: string
  point_amount: string
  period_unit: string
  period_count: string
  benefits: string
  extra: string
  sort: string
}

const emptyForm: ProductFormState = {
  id: null,
  product_code: "",
  product_type: "",
  platform: "ios",
  display_name: "",
  description: "",
  status: "active",
  price_amount: "0",
  currency: "CNY",
  point_amount: "0",
  period_unit: "",
  period_count: "0",
  benefits: "{}",
  extra: "{}",
  sort: "0",
}

function prettyJson(value?: Record<string, unknown>) {
  return JSON.stringify(value ?? {}, null, 2)
}

function formFromProduct(product: AdminBillingProductItem): ProductFormState {
  return {
    id: product.id,
    product_code: product.product_code,
    product_type: product.product_type,
    platform: product.platform,
    display_name: product.display_name,
    description: product.description || "",
    status: product.status,
    price_amount: String(product.price_amount),
    currency: product.currency,
    point_amount: String(product.point_amount),
    period_unit: product.period_unit || "",
    period_count: String(product.period_count || 0),
    benefits: prettyJson(product.benefits),
    extra: prettyJson(product.extra),
    sort: String(product.sort),
  }
}

function toOptionalObject(label: string, raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) {
    return undefined
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error(`${label} 必须是合法 JSON。`)
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} 必须是 JSON object。`)
  }

  return parsed as Record<string, unknown>
}

function toPayload(form: ProductFormState): AdminUpsertBillingProductPayload {
  if (!form.product_code.trim() || !form.product_type.trim() || !form.display_name.trim()) {
    throw new Error("请至少填写 product_code、product_type 和 display_name。")
  }
  if (!form.platform.trim() || !form.status.trim() || !form.currency.trim()) {
    throw new Error("platform、status、currency 为必填。")
  }

  return {
    product_code: form.product_code.trim(),
    product_type: form.product_type.trim(),
    platform: form.platform.trim(),
    display_name: form.display_name.trim(),
    description: form.description.trim() ? form.description.trim() : null,
    status: form.status.trim(),
    price_amount: Number(form.price_amount) || 0,
    currency: form.currency.trim(),
    point_amount: Number(form.point_amount) || 0,
    period_unit: form.period_unit.trim(),
    period_count: Number(form.period_count) || 0,
    benefits: toOptionalObject("Benefits", form.benefits),
    extra: toOptionalObject("Extra", form.extra),
    sort: Number(form.sort) || 0,
  }
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

export function BillingProductsAdminPage() {
  const { token, setToken, requireToken, ready } = useAdminToken()
  const [products, setProducts] = useState<AdminBillingProductItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedId) || null,
    [products, selectedId],
  )

  function updateFeedback(nextMessage = "", nextError = "") {
    setMessage(nextMessage)
    setError(nextError)
  }

  function loadProducts(preferredId?: number | null) {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        updateFeedback("正在加载 Billing Products…")
        const response = await getAdminBillingProducts(authToken)
        setProducts(response.items)

        const nextSelectedId =
          preferredId !== undefined ? preferredId : selectedId && response.items.some((item) => item.id === selectedId) ? selectedId : response.items[0]?.id ?? null

        setSelectedId(nextSelectedId)
        const nextSelected = response.items.find((item) => item.id === nextSelectedId) || null
        setForm(nextSelected ? formFromProduct(nextSelected) : emptyForm)
        updateFeedback("Billing Products 已刷新。")
      } catch (loadError) {
        updateFeedback("", loadError instanceof Error ? loadError.message : "加载失败")
      }
    })
  }

  function selectProduct(product: AdminBillingProductItem) {
    setSelectedId(product.id)
    setForm(formFromProduct(product))
    updateFeedback(`已切换到产品 ${product.product_code}。`)
  }

  function resetForm() {
    setSelectedId(null)
    setForm(emptyForm)
    updateFeedback("已切换到新建产品模式。")
  }

  function saveProduct() {
    const authToken = requireToken()
    if (!authToken) {
      updateFeedback("", "请先填写管理员 Bearer Token。")
      return
    }

    startTransition(async () => {
      try {
        const payload = toPayload(form)
        updateFeedback(form.id ? "正在更新产品…" : "正在创建产品…")
        const saved = form.id
          ? await updateAdminBillingProduct(authToken, form.id, payload)
          : await createAdminBillingProduct(authToken, payload)
        await getAdminBillingProducts(authToken).then((response) => {
          setProducts(response.items)
          setSelectedId(saved.id)
          const nextSelected = response.items.find((item) => item.id === saved.id) || saved
          setForm(formFromProduct(nextSelected))
        })
        updateFeedback(form.id ? "产品已更新。" : "产品已创建。")
      } catch (saveError) {
        updateFeedback("", saveError instanceof Error ? saveError.message : "保存失败")
      }
    })
  }

  useEffect(() => {
    if (!ready || !token.trim()) {
      return
    }
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <div className="grid gap-6">
      <section className="rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,244,255,0.94),rgba(255,247,237,0.94))] p-8 shadow-float">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Admin Console</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Billing products</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Create and edit subscription or point-pack products with direct control over pricing, entitlement metadata, sort order, and raw JSON benefits payloads.
        </p>
      </section>

      <AdminSessionPanel
        token={token}
        onTokenChange={setToken}
        onApply={() => loadProducts()}
        isBusy={isPending}
        message={message}
        error={error}
      />

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <AdminSectionCard
          title={form.id ? "Edit Product" : "Create Product"}
          description="Fields map directly to `/api/v1/admin/billing/products` and `/api/v1/admin/billing/products/:id`."
          action={
            <div className="flex flex-wrap gap-3">
              {form.id ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink"
                >
                  新建产品
                </button>
              ) : null}
              <button
                type="button"
                onClick={saveProduct}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isPending ? "处理中…" : form.id ? "保存更新" : "创建产品"}
              </button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Product Code" value={form.product_code} onChange={(value) => setForm((current) => ({ ...current, product_code: value }))} />
            <AdminField label="Display Name" value={form.display_name} onChange={(value) => setForm((current) => ({ ...current, display_name: value }))} />
            <AdminField label="Product Type" value={form.product_type} onChange={(value) => setForm((current) => ({ ...current, product_type: value }))} placeholder="subscription / points" />
            <AdminField label="Platform" value={form.platform} onChange={(value) => setForm((current) => ({ ...current, platform: value }))} placeholder="ios / web" />
            <AdminField label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} placeholder="active / inactive" />
            <AdminField label="Currency" value={form.currency} onChange={(value) => setForm((current) => ({ ...current, currency: value }))} placeholder="CNY / USD" />
            <AdminField label="Price Amount (fen)" value={form.price_amount} onChange={(value) => setForm((current) => ({ ...current, price_amount: value }))} type="number" />
            <AdminField label="Point Amount" value={form.point_amount} onChange={(value) => setForm((current) => ({ ...current, point_amount: value }))} type="number" />
            <AdminField label="Period Unit" value={form.period_unit} onChange={(value) => setForm((current) => ({ ...current, period_unit: value }))} placeholder="month / year / empty" />
            <AdminField label="Period Count" value={form.period_count} onChange={(value) => setForm((current) => ({ ...current, period_count: value }))} type="number" />
            <AdminField label="Sort" value={form.sort} onChange={(value) => setForm((current) => ({ ...current, sort: value }))} type="number" />
            <div className="rounded-[1rem] border border-dashed border-line bg-mist/70 px-4 py-3 text-sm text-slate-600">
              {selectedProduct ? (
                <>
                  <p className="font-semibold text-ink">当前产品 ID {selectedProduct.id}</p>
                  <p className="mt-1">Updated {formatUnixDateTime(selectedProduct.updated_at)}</p>
                  <p className="mt-1">Price {formatPriceFen(selectedProduct.price_amount, selectedProduct.currency)}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink">新建模式</p>
                  <p className="mt-1">创建后会自动切换到该产品的编辑视图。</p>
                </>
              )}
            </div>
            <div className="md:col-span-2">
              <AdminTextarea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} minHeightClass="min-h-24" />
            </div>
            <div className="md:col-span-2">
              <AdminTextarea label="Benefits JSON" value={form.benefits} onChange={(value) => setForm((current) => ({ ...current, benefits: value }))} minHeightClass="min-h-36" />
            </div>
            <div className="md:col-span-2">
              <AdminTextarea label="Extra JSON" value={form.extra} onChange={(value) => setForm((current) => ({ ...current, extra: value }))} minHeightClass="min-h-36" />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Product Library"
          description="Choose an existing product to edit, or stay in create mode to add a new one."
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/billing/orders" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
                View Orders
              </Link>
              <button
                type="button"
                onClick={() => loadProducts()}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                刷新产品
              </button>
            </div>
          }
        >
          {products.length === 0 ? (
            <AdminEmptyState title="No products loaded" description="Apply an admin token to load the billing product library." />
          ) : (
            <div className="grid gap-3">
              {products.map((product, index) => {
                const isActive = product.id === selectedId

                return (
                  <button
                    key={`${product.id}-${product.product_code}-${index}`}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                      isActive ? "border-accent bg-accent/5 shadow-soft" : "border-line bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{product.display_name}</p>
                          <AdminStatusBadge label={product.status} tone={statusTone(product.status)} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{product.product_code}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {product.product_type} · {product.platform} · Sort {product.sort}
                        </p>
                        {product.description ? <p className="mt-2 text-sm text-slate-600">{product.description}</p> : null}
                      </div>
                      <div className="text-sm text-slate-600">
                        <p className="font-semibold text-ink">{formatPriceFen(product.price_amount, product.currency)}</p>
                        <p className="mt-1">{product.point_amount.toLocaleString()} points</p>
                        {product.period_unit ? <p className="mt-1">{product.period_count} {product.period_unit}</p> : null}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </AdminSectionCard>
      </section>
    </div>
  )
}
