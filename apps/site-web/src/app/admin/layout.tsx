import type { Metadata } from "next"
import type { ReactNode } from "react"

import { AdminShell } from "@/components/admin/admin-shell"

export const metadata: Metadata = {
  title: {
    default: "DreamAI Admin",
    template: "%s | DreamAI Admin",
  },
  description: "Unified admin workspace for the DreamAI website CMS and internal operations console.",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <AdminShell>{children}</AdminShell>
}
