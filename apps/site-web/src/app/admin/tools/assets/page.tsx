import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Tool Assets",
}

export default function AdminToolAssetsPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Shared tool asset library"
      description="This route will manage reusable tool assets and support later binding into tool mode version sections."
      status="Backend APIs ready"
      scope={[
        "Asset list, filter, and detail",
        "Asset create, update, and delete",
        "Support for later asset-ref binding flows",
      ]}
      links={[
        { href: "/admin/tools", label: "Back to Tools" },
        { href: "/admin/publish-center", label: "Publish Center" },
      ]}
    />
  )
}
