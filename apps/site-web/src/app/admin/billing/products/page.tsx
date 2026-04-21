import Link from "next/link"

import { BillingProductsAdminPage } from "@/components/admin/billing-products-admin-page"

export const metadata = {
  title: "Billing Products",
}

export default function AdminBillingProductsPage() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <Link href="/admin/billing/orders" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          View Orders
        </Link>
      </div>
      <BillingProductsAdminPage />
    </div>
  )
}
