"use client"

import { useEffect, useState, useTransition } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { AdminField, AdminSectionCard } from "@/components/admin/admin-form-controls"
import { getAdminSession, loginAdmin, loginAdminByCode, mergeAdminSession, sendAdminLoginCode } from "@/lib/api/admin-auth"
import { type AdminSession, useAdminToken } from "@/components/admin/use-admin-token"

const ADMIN_ROLE = 5090
const SEND_CODE_COUNTDOWN = 60

type LoginMode = "code" | "password"

export function AdminLoginPage() {
  const router = useRouter()
  const { ready, session, token, persistSession, updateSession, clearSession } = useAdminToken()
  const [mode, setMode] = useState<LoginMode>("code")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const adminHomePath = "/admin/site"

  useEffect(() => {
    if (!ready) {
      return
    }

    const accessToken = token.trim()
    if (!accessToken || !session) {
      return
    }

    startTransition(async () => {
      try {
        const currentSession = await getAdminSession(accessToken)

        if (currentSession.role !== ADMIN_ROLE) {
          clearSession()
          return
        }

        updateSession(mergeAdminSession(session, currentSession))
        router.replace(adminHomePath)
      } catch {
        clearSession()
      }
    })
  }, [adminHomePath, clearSession, ready, router, session, token, updateSession])

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setCooldown((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldown])

  function handleLoginSuccess(nextSession: AdminSession) {
    persistSession(nextSession)
    setMessage("登录成功，正在进入后台…")
    setError("")
    router.replace(adminHomePath)
  }

  function submitPasswordLogin() {
    if (!username.trim() || !password) {
      setError("请输入管理员用户名和密码。")
      setMessage("")
      return
    }

    startTransition(async () => {
      try {
        setMessage("正在登录管理后台…")
        setError("")
        const nextSession = await loginAdmin(username.trim(), password)

        if (nextSession.role !== ADMIN_ROLE) {
          clearSession()
          setMessage("")
          setError("当前账号不是管理员，无法进入后台。")
          return
        }

        handleLoginSuccess(nextSession)
      } catch (loginError) {
        setMessage("")
        setError(loginError instanceof Error ? loginError.message : "登录失败")
      }
    })
  }

  function submitCodeLogin() {
    if (!phone.trim() || !code.trim()) {
      setError("请输入管理员手机号和短信验证码。")
      setMessage("")
      return
    }

    startTransition(async () => {
      try {
        setMessage("正在校验验证码并登录后台…")
        setError("")
        const nextSession = await loginAdminByCode(phone.trim(), code.trim())

        if (nextSession.role !== ADMIN_ROLE) {
          clearSession()
          setMessage("")
          setError("当前手机号未绑定管理员账号，无法进入后台。")
          return
        }

        handleLoginSuccess(nextSession)
      } catch (loginError) {
        setMessage("")
        setError(loginError instanceof Error ? loginError.message : "验证码登录失败")
      }
    })
  }

  function requestCode() {
    if (!phone.trim()) {
      setError("请先输入已绑定管理员账号的手机号。")
      setMessage("")
      return
    }

    startTransition(async () => {
      try {
        setMessage("正在发送管理员登录验证码…")
        setError("")
        const response = await sendAdminLoginCode(phone.trim())
        setCooldown(SEND_CODE_COUNTDOWN)
        setMessage(response.message || "验证码已发送，请留意短信。")
      } catch (sendError) {
        setMessage("")
        setError(sendError instanceof Error ? sendError.message : "发送验证码失败")
      }
    })
  }

  return (
    <div className="grid w-full gap-6 xl:grid-cols-[1fr_0.92fr]">
      <section className="rounded-[2.4rem] border border-white/80 bg-[linear-gradient(135deg,rgba(9,17,29,0.96),rgba(16,32,51,0.92),rgba(15,118,110,0.78))] p-8 text-white shadow-float xl:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">DreamAI Admin</p>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight">管理员登录</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/76">
          后台现在支持管理员手机号短信验证码登录，也保留账号密码登录作为兼容入口。正式使用建议优先走手机号验证码登录。
        </p>
        <div className="mt-8 grid gap-3 text-sm text-white/72">
          <p>短信验证码只会发送给已绑定管理员账号的手机号。</p>
          <p>登录成功后会自动建立 admin session，并统一用于 `/api/v1/admin/*` 请求。</p>
          <p>后台启动时会通过 `/api/v1/admin/session` 自动校验当前管理员登录态。</p>
        </div>
        <div className="mt-8">
          <Link href="/admin/site" className="rounded-full border border-white/18 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
            返回后台首页壳层
          </Link>
        </div>
      </section>

      <AdminSectionCard
        title="Admin Sign In"
        description="Use a bound admin phone number with SMS verification, or switch to password login if needed."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("code")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "code" ? "bg-accent text-white" : "border border-line bg-white text-ink"}`}
            >
              短信验证码
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "password" ? "bg-accent text-white" : "border border-line bg-white text-ink"}`}
            >
              账号密码
            </button>
          </div>
        }
      >
        <div className="grid gap-4">
          {mode === "code" ? (
            <>
              <AdminField label="Phone" value={phone} onChange={setPhone} placeholder="输入管理员手机号" />
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <AdminField label="Code" value={code} onChange={setCode} placeholder="输入短信验证码" />
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={cooldown > 0}
                  className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {cooldown > 0 ? `${cooldown}s 后重试` : "发送验证码"}
                </button>
              </div>
              <button
                type="button"
                onClick={submitCodeLogin}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isPending ? "登录中…" : "验证码登录"}
              </button>
            </>
          ) : (
            <>
              <AdminField label="Username" value={username} onChange={setUsername} placeholder="输入管理员用户名" />
              <AdminField label="Password" value={password} onChange={setPassword} placeholder="输入管理员密码" type="password" />
              <button
                type="button"
                onClick={submitPasswordLogin}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                {isPending ? "登录中…" : "密码登录"}
              </button>
            </>
          )}
          {message ? <p className="rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        </div>
      </AdminSectionCard>
    </div>
  )
}
