import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Tools",
}

export default function AdminToolsPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Tool definition and mode management"
      description="This route will evolve into the most complex admin area: tool definitions, modes, mode versions, workflow references, and JSON configuration editors."
      status="Backend APIs ready"
      scope={[
        "Tool definition list and detail",
        "Mode and version hierarchy",
        "Workflow-aware JSON config editing and publish flows",
      ]}
      links={[
        { href: "/admin/tools/assets", label: "Tool Assets" },
        { href: "/admin/workflows", label: "Workflows" },
      ]}
    />
  )
}
