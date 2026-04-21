import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"

import { SiteShell } from "@/components/layout/site-shell"
import { getSiteConfig } from "@/lib/api/site"

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return {
    title: config.seo_title || config.site_title,
    description: config.seo_description || config.site_subtitle,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const config = await getSiteConfig()

  return (
    <html lang="en">
      <body>
        <SiteShell config={config}>{children}</SiteShell>
      </body>
    </html>
  )
}
