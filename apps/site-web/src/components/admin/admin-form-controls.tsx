"use client"

import type { ReactNode } from "react"

export function AdminSectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-line bg-white/90 p-6">
      <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function AdminField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  )
}

export function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  minHeightClass = "min-h-32",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeightClass?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-ink outline-none ${minHeightClass}`}
      />
    </label>
  )
}

export function AdminToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 pt-8">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  )
}
