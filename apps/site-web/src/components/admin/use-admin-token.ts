"use client"

import { useEffect, useState } from "react"

const ADMIN_TOKEN_STORAGE_KEY = "dreamai-admin-token"
const ADMIN_SESSION_STORAGE_KEY = "dreamai-admin-session"
const ADMIN_ROLE = 5090

export type AdminSession = {
  accessToken: string
  refreshToken: string
  accessExp: number
  refreshExp: number
  userId: number
  role: number
  nickname?: string
  avatarUrl?: string
  permissions?: string[]
  sessionExpiredAt?: number
}

export function useAdminToken() {
  const [token, setToken] = useState("")
  const [session, setSession] = useState<AdminSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const rawSession = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY)

    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession) as AdminSession
        if (parsed.accessToken) {
          setSession(parsed)
          setToken(parsed.accessToken)
          setReady(true)
          return
        }
      } catch {
        window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
      }
    }

    const savedToken = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
    if (savedToken) {
      setToken(savedToken)
    }
    setReady(true)
  }, [])

  function persistToken(nextToken: string) {
    const trimmed = nextToken.trim()
    setToken(nextToken)

    if (!trimmed) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      return ""
    }

    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmed)
    return trimmed
  }

  function persistSession(nextSession: AdminSession) {
    setSession(nextSession)
    setToken(nextSession.accessToken)
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextSession.accessToken)
    window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    return nextSession.accessToken
  }

  function updateSession(nextSession: AdminSession) {
    return persistSession(nextSession)
  }

  function clearSession() {
    setSession(null)
    setToken("")
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
  }

  function requireToken() {
    const trimmed = token.trim()
    if (!trimmed) {
      return null
    }
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmed)
    return trimmed
  }

  return {
    token,
    setToken,
    session,
    isAdmin: session?.role === ADMIN_ROLE,
    persistToken,
    persistSession,
    updateSession,
    clearSession,
    requireToken,
    ready,
  }
}
