import type { Metadata } from "next"

import { AdminLoginPage } from "@/components/admin/admin-login-page"

export const metadata: Metadata = {
  title: "Admin Login",
}

export default function AdminLoginRoutePage() {
  return <AdminLoginPage />
}
