import { AdminRoutePlaceholder } from "@/components/admin/admin-route-placeholder"

export const metadata = {
  title: "Operations",
}

export default function AdminOperationsPage() {
  return (
    <AdminRoutePlaceholder
      eyebrow="Admin Console"
      title="Internal operations modules live here"
      description="This area is reserved for the real business backoffice: users, billing, templates, tools, publish center, and home banner operations."
      status="Route skeleton ready"
      scope={[
        "User lifecycle and account operations",
        "Billing products, orders, wallet views, and manual point adjustments",
        "Template operations, tool configuration, and publish workflows",
      ]}
      links={[
        { href: "/admin/users", label: "Go to Users" },
        { href: "/admin/billing/orders", label: "Go to Billing" },
        { href: "/admin/templates", label: "Go to Templates" },
      ]}
    />
  )
}
