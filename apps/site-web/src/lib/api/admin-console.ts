import { getClientDeviceHeaders } from "@/lib/client-device"
import type {
  AdminAdjustPointsResponse,
  AdminBillingOrderDetailResponse,
  AdminBillingOrderListParams,
  AdminBillingOrderListResponse,
  AdminBillingProductListResponse,
  AdminBillingProductItem,
  AdminBillingWalletResponse,
  AdminForceLogoutResponse,
  AdminPointLedgerListParams,
  AdminPointLedgerListResponse,
  AdminUnbindAuthResponse,
  AdminUpsertBillingProductPayload,
  AdminUserDetailResponse,
  AdminUserDeviceListResponse,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserStatusResponse,
} from "@/types/admin"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1"

type ApiEnvelope<T> = {
  code: number
  msg: string
  data: T
}

async function request<T>(path: string, options: RequestInit & { token: string }): Promise<T> {
  const deviceHeaders = getClientDeviceHeaders()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`,
      ...deviceHeaders,
      ...(options.headers || {}),
    },
  })

  const payload = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.msg || `Request failed: ${response.status}`)
  }

  return payload.data
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return
    }
    search.set(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ""
}

export function getAdminUsers(token: string, params: AdminUserListParams = {}) {
  return request<AdminUserListResponse>(
    `/admin/users${buildQuery({
      keyword: params.keyword,
      role: params.role,
      is_active: params.is_active,
      register_source: params.register_source,
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
    })}`,
    { method: "GET", token },
  )
}

export function getAdminUserDetail(token: string, userId: number) {
  return request<AdminUserDetailResponse>(`/admin/users/${userId}`, { method: "GET", token })
}

export function getAdminUserDevices(token: string, userId: number) {
  return request<AdminUserDeviceListResponse>(`/admin/users/${userId}/devices`, { method: "GET", token })
}

export function updateAdminUserProfile(
  token: string,
  userId: number,
  body: {
    nickname?: string
    avatar_url?: string
  },
) {
  return request<AdminUserDetailResponse>(`/admin/users/${userId}/profile`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function activateAdminUser(token: string, userId: number) {
  return request<AdminUserStatusResponse>(`/admin/users/${userId}/activate`, {
    method: "POST",
    token,
  })
}

export function deactivateAdminUser(token: string, userId: number) {
  return request<AdminUserStatusResponse>(`/admin/users/${userId}/deactivate`, {
    method: "POST",
    token,
  })
}

export function promoteAdminUser(token: string, userId: number) {
  return request<AdminUserStatusResponse>(`/admin/users/${userId}/promote-admin`, {
    method: "POST",
    token,
  })
}

export function revokeAdminUser(token: string, userId: number) {
  return request<AdminUserStatusResponse>(`/admin/users/${userId}/revoke-admin`, {
    method: "POST",
    token,
  })
}

export function forceLogoutAdminUser(token: string, userId: number) {
  return request<AdminForceLogoutResponse>(`/admin/users/${userId}/force-logout`, {
    method: "POST",
    token,
  })
}

export function unbindAppleAdminUser(token: string, userId: number) {
  return request<AdminUnbindAuthResponse>(`/admin/users/${userId}/unbind-apple`, {
    method: "POST",
    token,
  })
}

export function getAdminBillingOrders(token: string, params: AdminBillingOrderListParams = {}) {
  return request<AdminBillingOrderListResponse>(
    `/admin/billing/orders${buildQuery({
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      user_id: params.user_id,
      status: params.status,
      product_type: params.product_type,
    })}`,
    { method: "GET", token },
  )
}

export function getAdminBillingOrderDetail(token: string, orderId: number) {
  return request<AdminBillingOrderDetailResponse>(`/admin/billing/orders/${orderId}`, {
    method: "GET",
    token,
  })
}

export function getAdminBillingProducts(token: string) {
  return request<AdminBillingProductListResponse>("/admin/billing/products", {
    method: "GET",
    token,
  })
}

export function createAdminBillingProduct(token: string, body: AdminUpsertBillingProductPayload) {
  return request<AdminBillingProductItem>("/admin/billing/products", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}

export function updateAdminBillingProduct(token: string, productId: number, body: AdminUpsertBillingProductPayload) {
  return request<AdminBillingProductItem>(`/admin/billing/products/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  })
}

export function getAdminBillingUserWallet(token: string, userId: number) {
  return request<AdminBillingWalletResponse>(`/admin/billing/users/${userId}/wallet`, {
    method: "GET",
    token,
  })
}

export function getAdminBillingUserPointLedgers(
  token: string,
  userId: number,
  params: AdminPointLedgerListParams = {},
) {
  return request<AdminPointLedgerListResponse>(
    `/admin/billing/users/${userId}/point-ledgers${buildQuery({
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      change_type: params.change_type,
    })}`,
    {
      method: "GET",
      token,
    },
  )
}

export function adjustAdminBillingUserPoints(
  token: string,
  userId: number,
  body: {
    points: number
    biz_id: string
    remark: string
  },
) {
  return request<AdminAdjustPointsResponse>(`/admin/billing/users/${userId}/adjust-points`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })
}
