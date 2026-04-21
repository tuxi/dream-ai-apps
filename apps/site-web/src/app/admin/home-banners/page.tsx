import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Home Banners",
}

export default function AdminHomeBannersPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Home banner operations"
      description="This route will support banner listing, scheduling, publish and offline operations, and task-derived banner publishing."
      status="Backend APIs ready"
      scope={[
        "Banner list and filter controls",
        "Banner create and edit with schedule fields",
        "Publish, offline, and delete flows",
      ]}
      links={[
        { href: "/admin/publish-center", label: "Publish Center" },
        { href: "/admin/operations", label: "Back to Operations" },
      ]}
    />
  )
}
