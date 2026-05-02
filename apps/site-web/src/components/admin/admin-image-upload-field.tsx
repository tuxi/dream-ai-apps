"use client"

import { useId, useState, useTransition } from "react"

import { getAdminMediaSts } from "@/lib/api/site-admin"
import { uploadFileToAdminMedia } from "@/lib/admin-media-upload"

export function AdminImageUploadField({
  label,
  value,
  token,
  onChange,
}: {
  label: string
  value: string
  token: string
  onChange: (value: string) => void
}) {
  const inputId = useId()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleFileChange(file: File | null) {
    if (!file) {
      return
    }

    const authToken = token.trim()
    if (!authToken) {
      setError("当前管理员会话不存在，请先登录后台。")
      setMessage("")
      return
    }

    startTransition(async () => {
      try {
        setMessage("正在上传图片…")
        setError("")
        const sts = await getAdminMediaSts(authToken)
        const uploaded = await uploadFileToAdminMedia(sts, file)
        onChange(uploaded.url)
        setMessage("图片已上传并自动回填 URL。")
      } catch (uploadError) {
        setMessage("")
        setError(uploadError instanceof Error ? uploadError.message : "上传失败")
      }
    })
  }

  return (
    <div className="rounded-[1rem] border border-dashed border-line bg-mist/60 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="mt-1 text-xs text-slate-500">支持后台 STS 直传，上传成功后会自动写入当前字段。</p>
        </div>
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          {isPending ? "上传中…" : "选择图片"}
        </label>
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
      />

      {value ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[6rem_minmax(0,1fr)] md:items-center">
          <img src={value} alt={label} className="h-24 w-24 rounded-[1rem] border border-line bg-white object-cover" />
          <p className="break-all text-xs text-slate-500">{value}</p>
        </div>
      ) : null}

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
    </div>
  )
}
