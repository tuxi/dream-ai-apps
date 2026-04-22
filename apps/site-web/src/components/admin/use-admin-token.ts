"use client"

import { useEffect, useState } from "react"

const ADMIN_TOKEN_STORAGE_KEY = "dreamai-admin-token"
const ADMIN_SESSION_STORAGE_KEY = "dreamai-admin-session"
const ADMIN_ROLE = 5090
const ADMIN_SESSION_CHANGE_EVENT = "dreamai-admin-session-change"

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
    function syncFromStorage() {
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
      setSession(null)
      setToken(savedToken || "")
      setReady(true)
    }

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key === ADMIN_SESSION_STORAGE_KEY || event.key === ADMIN_TOKEN_STORAGE_KEY) {
        syncFromStorage()
      }
    }

    function handleSessionChange() {
      syncFromStorage()
    }

    syncFromStorage()
    window.addEventListener("storage", handleStorage)
    window.addEventListener(ADMIN_SESSION_CHANGE_EVENT, handleSessionChange)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(ADMIN_SESSION_CHANGE_EVENT, handleSessionChange)
    }
  }, [])

  function notifySessionChanged() {
    window.dispatchEvent(new Event(ADMIN_SESSION_CHANGE_EVENT))
  }

  function persistToken(nextToken: string) {
    const trimmed = nextToken.trim()
    setToken(nextToken)

    if (!trimmed) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      notifySessionChanged()
      return ""
    }

    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmed)
    notifySessionChanged()
    return trimmed
  }

  function persistSession(nextSession: AdminSession) {
    setSession(nextSession)
    setToken(nextSession.accessToken)
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextSession.accessToken)
    window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    notifySessionChanged()
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
    notifySessionChanged()
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
