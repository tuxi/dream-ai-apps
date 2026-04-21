import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Templates",
}

export default function AdminTemplatesPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Template operations"
      description="This route will become the management hub for template listing, filtering, detail editing, category creation, publishing, and offline flows."
      status="Backend APIs ready"
      scope={[
        "Template list and status filters",
        "Template detail, version-aware editing, and publish controls",
        "Template category management",
      ]}
      links={[
        { href: "/admin/operations", label: "Back to Operations" },
        { href: "/admin/publish-center", label: "Publish Center" },
      ]}
    />
  )
}
