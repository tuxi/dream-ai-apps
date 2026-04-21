import type { Metadata } from "next"

import { BillingUserPointLedgersPage } from "@/components/admin/billing-user-point-ledgers-page"

export const metadata: Metadata = {
  title: "Point Ledgers",
}

export default function BillingUserPointLedgersRoutePage({
  params,
}: {
  params: { id: string }
}) {
  const userId = Number(params.id)

  if (!Number.isFinite(userId) || userId <= 0) {
    return null
  }

  return <BillingUserPointLedgersPage userId={userId} />
}
