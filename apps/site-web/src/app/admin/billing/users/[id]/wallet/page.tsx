import type { Metadata } from "next"

import { BillingUserWalletPage } from "@/components/admin/billing-user-wallet-page"

export const metadata: Metadata = {
  title: "User Wallet",
}

export default function BillingUserWalletRoutePage({
  params,
}: {
  params: { id: string }
}) {
  const userId = Number(params.id)

  if (!Number.isFinite(userId) || userId <= 0) {
    return null
  }

  return <BillingUserWalletPage userId={userId} />
}
