"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ReactNode } from "react"

import { SiteConfig } from "@/types/site"

export function SiteShell({
  children,
  config,
}: {
  children: ReactNode
  config: SiteConfig
}) {
  const t = useTranslations("SiteShell")

  const navItems = [
    { href: "/features", label: t("nav.features") },
    { href: "/about", label: t("nav.about") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/download", label: t("nav.download") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),transparent_32%),linear-gradient(180deg,#f7fbff_0%,#ffffff_48%,#eef6ff_100%)] text-ink">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {config.app_name} <span className="text-sm font-medium text-slate-500">{t("footer.by")} {config.brand_name}</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={config.primary_cta_link || "/download"}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {config.primary_cta_text || t("nav.download")}
          </Link>
        </div>
      </header>
      <main className="overflow-hidden">{children}</main>
      <footer className="border-t border-line/80 bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>{config.footer_text || `${config.app_name} is a product ${t("footer.by")} ${config.brand_name}.`}</p>
            <div className="flex gap-4">
              <Link href="/privacy">{t("footer.privacy")}</Link>
              <Link href="/terms">{t("footer.terms")}</Link>
              <Link href="/contact">{t("footer.contact")}</Link>
              <a href="https://github.com/tuxi" target="_blank" rel="noopener noreferrer">{t("footer.github")}</a>
            </div>
          </div>
          <div className="mt-6 border-t border-line/50 pt-5 text-center">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 transition hover:text-slate-600"
            >
              {t("footer.icp")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
