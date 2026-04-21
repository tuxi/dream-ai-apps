import type { Metadata } from "next"

import { UserDetailAdminPage } from "@/components/admin/user-detail-admin-page"

export const metadata: Metadata = {
  title: "User Detail",
}

export default function AdminUserDetailRoutePage({
  params,
}: {
  params: { id: string }
}) {
  const userId = Number(params.id)

  if (!Number.isFinite(userId) || userId <= 0) {
    return null
  }

  return <UserDetailAdminPage userId={userId} />
}
