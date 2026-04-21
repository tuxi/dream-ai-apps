import type { Metadata } from "next"

import { SiteAdminPanel } from "@/components/admin/site-admin-panel"

export const metadata: Metadata = {
  title: "Site Admin | DreamAI",
  description: "Minimal admin console for DreamAI site content.",
}

export default function SiteAdminPage() {
  return <SiteAdminPanel />
}
