"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { SiteShell } from "@/components/layout/site-shell"
import type { SiteConfig } from "@/types/site"

export function AppFrame({
  children,
  config,
}: {
  children: ReactNode
  config: SiteConfig
}) {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return <>{children}</>
  }

  return <SiteShell config={config}>{children}</SiteShell>
}
