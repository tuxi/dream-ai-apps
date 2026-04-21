import type { Metadata } from "next"

import { BillingOrderDetailPage } from "@/components/admin/billing-order-detail-page"

export const metadata: Metadata = {
  title: "Billing Order Detail",
}

export default function BillingOrderDetailRoutePage({
  params,
}: {
  params: { id: string }
}) {
  const orderId = Number(params.id)

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return null
  }

  return <BillingOrderDetailPage orderId={orderId} />
}
