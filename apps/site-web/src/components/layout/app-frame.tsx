"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, type ReactNode } from "react"

import { SiteShell } from "@/components/layout/site-shell"
import type { SiteConfig } from "@/types/site"

function AppFrameInner({
  children,
  config,
}: {
  children: ReactNode
  config: SiteConfig
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const standalone = searchParams.get("standalone") === "1"

  if (pathname.startsWith("/admin") || standalone) {
    return <>{children}</>
  }

  return <SiteShell config={config}>{children}</SiteShell>
}

export function AppFrame({
  children,
  config,
}: {
  children: ReactNode
  config: SiteConfig
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AppFrameInner config={config}>{children}</AppFrameInner>
    </Suspense>
  )
}
