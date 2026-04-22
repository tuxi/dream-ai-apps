"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState, useTransition } from "react"

import { usePathname, useRouter } from "next/navigation"

import { AdminNav } from "@/components/admin/admin-nav"
import { getAdminSession, logoutAdminSession, mergeAdminSession, refreshAdminSession } from "@/lib/api/admin-auth"
import { useAdminToken } from "@/components/admin/use-admin-token"

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { ready, token, session, updateSession, persistSession, clearSession } = useAdminToken()
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isPending, startTransition] = useTransition()
  const bootstrapKeyRef = useRef<string | null>(null)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!ready) {
      return
    }

    if (isLoginPage) {
      setIsBootstrapping(false)
      return
    }

    const accessToken = token.trim()
    if (!accessToken) {
      bootstrapKeyRef.current = null
      setIsBootstrapping(false)
      router.replace("/admin/login")
      return
    }

    const nextBootstrapKey = `${pathname}:${accessToken}`
    if (bootstrapKeyRef.current === nextBootstrapKey) {
      setIsBootstrapping(false)
      return
    }
    bootstrapKeyRef.current = nextBootstrapKey

    startTransition(async () => {
      try {
        const currentSession = await getAdminSession(accessToken)
        if (session) {
          updateSession(mergeAdminSession(session, currentSession))
        }
        setIsBootstrapping(false)
      } catch {
        if (!session?.refreshToken) {
          clearSession()
          setIsBootstrapping(false)
          router.replace("/admin/login")
          return
        }

        try {
          const refreshedSession = await refreshAdminSession(session.refreshToken)
          persistSession({
            ...session,
            ...refreshedSession,
            nickname: refreshedSession.nickname || session.nickname,
            avatarUrl: refreshedSession.avatarUrl || session.avatarUrl,
            permissions: refreshedSession.permissions || session.permissions,
          })

          const currentSession = await getAdminSession(refreshedSession.accessToken)
          updateSession(mergeAdminSession({ ...session, ...refreshedSession }, currentSession))
          setIsBootstrapping(false)
          router.refresh()
        } catch {
          clearSession()
          setIsBootstrapping(false)
          router.replace("/admin/login")
        }
      }
    })
  }, [clearSession, isLoginPage, pathname, persistSession, ready, router, session, token, updateSession])

  async function handleLogout() {
    const accessToken = token.trim()

    try {
      if (accessToken) {
        await logoutAdminSession(accessToken)
      }
    } catch {
      // Ignore logout API failures and clear local session anyway.
    } finally {
      clearSession()
      router.replace("/admin/login")
      router.refresh()
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_48%,#ffffff_100%)]">
        <div className="rounded-[1.5rem] border border-line bg-white px-6 py-5 text-sm text-slate-600 shadow-soft">正在准备管理后台…</div>
      </div>
    )
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_24%),linear-gradient(180deg,#eef4ff_0%,#f8fbff_48%,#ffffff_100%)]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 xl:px-10">{children}</div>
      </div>
    )
  }

  if (!token.trim()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_48%,#ffffff_100%)]">
        <div className="rounded-[1.5rem] border border-line bg-white px-6 py-5 text-sm text-slate-600 shadow-soft">正在跳转到管理员登录页…</div>
      </div>
    )
  }

  if (isBootstrapping || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_48%,#ffffff_100%)]">
        <div className="rounded-[1.5rem] border border-line bg-white px-6 py-5 text-sm text-slate-600 shadow-soft">正在校验管理员会话…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_24%),linear-gradient(180deg,#eef4ff_0%,#f8fbff_48%,#ffffff_100%)]">
      <div className="xl:flex">
        <AdminNav />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 xl:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Admin</p>
                <p className="mt-1 text-sm text-slate-600">
                  Unified shell for the DreamAI website CMS and internal operations console.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {session?.nickname ? `${session.nickname} · Admin` : session ? `Admin User ${session.userId}` : "Internal Only"}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  退出登录
                </button>
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-7xl px-6 py-8 xl:px-10 xl:py-10">{children}</div>
        </div>
      </div>
    </div>
  )
}
