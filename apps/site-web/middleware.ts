import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { DEVICE_ID_COOKIE } from "@/lib/device-constants"

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 跳过 admin 路径——不需要 i18n
  if (pathname.startsWith("/admin")) {
    return applyDeviceId(request)
  }

  // 跳过 _next 静态资源和 API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const response = intlMiddleware(request)
  if (response) {
    return applyDeviceIdCookie(request, response)
  }

  return applyDeviceId(request)
}

function applyDeviceId(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const deviceId = request.cookies.get(DEVICE_ID_COOKIE)?.value || crypto.randomUUID().replace(/-/g, "")
  requestHeaders.set("x-dreamai-device-id", deviceId)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
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

function applyDeviceIdCookie(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get(DEVICE_ID_COOKIE)?.value) {
    const deviceId = crypto.randomUUID().replace(/-/g, "")
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
