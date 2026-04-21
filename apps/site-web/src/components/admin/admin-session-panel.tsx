"use client"

export function AdminSessionPanel({
  token,
  onTokenChange,
  onApply,
  isBusy,
  message,
  error,
}: {
  token: string
  onTokenChange: (value: string) => void
  onApply: () => void
  isBusy?: boolean
  message?: string
  error?: string
}) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700">管理员 Access Token</label>
          <textarea
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-[1.25rem] border border-line bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            placeholder="登录后会自动写入；仅在调试后台接口时手动覆盖"
          />
        </div>
        <button
          type="button"
          onClick={onApply}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {isBusy ? "加载中…" : "刷新会话"}
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
    </section>
  )
}
