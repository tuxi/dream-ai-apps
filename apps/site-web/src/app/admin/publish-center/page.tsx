import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Publish Center",
}

export default function AdminPublishCenterPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Task publish center"
      description="This route will connect successful AI task outputs to operational publishing flows for tool assets, templates, asset binding, and home banners."
      status="Backend APIs ready"
      scope={[
        "Publish center task list and detail",
        "Draft builders for tool asset, template, and home banner",
        "Fast publish and publish-plus-bind workflows",
      ]}
      links={[
        { href: "/admin/templates", label: "Templates" },
        { href: "/admin/home-banners", label: "Home Banners" },
      ]}
    />
  )
}
