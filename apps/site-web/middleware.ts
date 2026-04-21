import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { DEVICE_ID_COOKIE } from "@/lib/device-constants"

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const deviceId = request.cookies.get(DEVICE_ID_COOKIE)?.value || crypto.randomUUID().replace(/-/g, "")
  requestHeaders.set("x-dreamai-device-id", deviceId)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  if (!request.cookies.get(DEVICE_ID_COOKIE)?.value) {
    response.cookies.set({
      name: DEVICE_ID_COOKIE,
      value: deviceId,
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
