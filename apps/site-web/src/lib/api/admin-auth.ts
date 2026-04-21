import type { AdminSession } from "@/components/admin/use-admin-token"
import { getClientDeviceHeaders } from "@/lib/client-device"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1"

type ApiEnvelope<T> = {
  code: number
  msg: string
  data: T
}

type AdminAuthTokenResponse = {
  access_token: string
  refresh_token: string
  access_exp: number
  refresh_exp: number
  user_id: number
  role: number
  nickname?: string
  avatar_url?: string
  permissions?: string[]
}

type AdminSendLoginCodeResponse = {
  success: boolean
  message?: string
}

type AdminSessionResponse = {
  user_id: number
  role: number
  nickname?: string
  avatar_url?: string
  permissions?: string[]
  session_expired_at?: number
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getClientDeviceHeaders(),
      ...(options.headers || {}),
    },
  })

  const payload = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.msg || `Request failed: ${response.status}`)
  }

  return payload.data
}

function toAdminSession(payload: AdminAuthTokenResponse): AdminSession {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    accessExp: payload.access_exp,
    refreshExp: payload.refresh_exp,
    userId: payload.user_id,
    role: payload.role,
    nickname: payload.nickname,
    avatarUrl: payload.avatar_url,
    permissions: payload.permissions,
  }
}

export async function loginAdmin(username: string, password: string): Promise<AdminSession> {
  const response = await request<AdminAuthTokenResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  return toAdminSession(response)
}

export function sendAdminLoginCode(phone: string) {
  return request<AdminSendLoginCodeResponse>("/admin/send-login-code", {
    method: "POST",
    body: JSON.stringify({ phone }),
  })
}

export async function loginAdminByCode(phone: string, code: string): Promise<AdminSession> {
  const response = await request<AdminAuthTokenResponse>("/admin/login-by-code", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  })

  return toAdminSession(response)
}

export async function refreshAdminSession(refreshToken: string): Promise<AdminSession> {
  const response = await request<AdminAuthTokenResponse>("/admin/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  return toAdminSession(response)
}

export function getAdminSession(token: string) {
  return request<AdminSessionResponse>("/admin/session", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function logoutAdminSession(token: string) {
  return request<Record<string, never>>("/admin/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
