import type { Metadata } from "next"
import type { ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import "./globals.css"

import { AppFrame } from "@/components/layout/app-frame"
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

  let locale = "zh"
  let messages: Record<string, unknown> | undefined

  try {
    locale = await getLocale()
    messages = (await getMessages()) as Record<string, unknown>
  } catch {
    // Admin 路径跳过 i18n 中间件，没有上下文
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppFrame config={config}>{children}</AppFrame>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
