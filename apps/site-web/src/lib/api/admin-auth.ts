import type { AdminSession } from "@/components/admin/use-admin-token"
import { getClientDeviceHeaders } from "@/lib/client-device"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1"

type ApiEnvelope<T> = {
  code: number
  msg: string
  data: T
}

type AdminAuthTokenResponse = Record<string, unknown>

type AdminSendLoginCodeResponse = {
  success: boolean
  message?: string
}

type AdminSessionResponse = Record<string, unknown>

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getClientDeviceHeaders(),
      ...(options.headers || {}),
    },
  })

  const rawText = await response.text()
  const payload = rawText ? (JSON.parse(rawText) as ApiEnvelope<T>) : null
  if (!response.ok || (payload && payload.code !== 0)) {
    throw new Error(payload?.msg || `Request failed: ${response.status}`)
  }

  return (payload?.data ?? ({} as T)) as T
}

function readString(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === "string" && value.trim()) {
      return value
    }
  }
  return ""
}

function readNumber(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }
  }
  return 0
}

function readStringArray(payload: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string")
    }
  }
  return undefined
}

function toAdminSession(payload: AdminAuthTokenResponse): AdminSession {
  return {
    accessToken: readString(payload, "access_token", "accessToken"),
    refreshToken: readString(payload, "refresh_token", "refreshToken"),
    accessExp: readNumber(payload, "access_exp", "accessExp"),
    refreshExp: readNumber(payload, "refresh_exp", "refreshExp"),
    userId: readNumber(payload, "user_id", "userId"),
    role: readNumber(payload, "role"),
    nickname: readString(payload, "nickname"),
    avatarUrl: readString(payload, "avatar_url", "avatarUrl"),
    permissions: readStringArray(payload, "permissions"),
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

export function mergeAdminSession(current: AdminSession, payload: AdminSessionResponse) {
  return {
    ...current,
    userId: readNumber(payload, "user_id", "userId") || current.userId,
    role: readNumber(payload, "role") || current.role,
    nickname: readString(payload, "nickname") || current.nickname,
    avatarUrl: readString(payload, "avatar_url", "avatarUrl") || current.avatarUrl,
    permissions: readStringArray(payload, "permissions") || current.permissions,
    sessionExpiredAt: readNumber(payload, "session_expired_at", "sessionExpiredAt") || current.sessionExpiredAt,
  }
}

export function logoutAdminSession(token: string) {
  return request<Record<string, never>>("/admin/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
