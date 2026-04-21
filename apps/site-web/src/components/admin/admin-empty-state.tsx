export function AdminEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-line bg-white/80 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  )
}
