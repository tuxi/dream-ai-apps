import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Workflows",
}

export default function AdminWorkflowsPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Workflow reference view"
      description="This route is reserved for workflow discovery and selection support while tool version editing becomes more structured."
      status="Backend API ready"
      scope={[
        "Workflow list and selection support",
        "Later linkage into tool mode version editing",
        "Read-only operational reference",
      ]}
      links={[{ href: "/admin/tools", label: "Back to Tools" }]}
    />
  )
}
