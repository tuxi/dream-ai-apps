import { cookies, headers } from "next/headers"

import { DEVICE_ID_COOKIE, WEB_APP_VERSION } from "@/lib/device-constants"
import { describeDeviceFromUserAgent } from "@/lib/device-profile"

export async function getServerDeviceHeaders() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const deviceId =
    headerStore.get("x-dreamai-device-id") ||
    cookieStore.get(DEVICE_ID_COOKIE)?.value ||
    "site-web-server-fallback"
  const userAgent = headerStore.get("user-agent") || ""
  const profile = describeDeviceFromUserAgent(userAgent)

  return {
    "X-Device-ID": deviceId,
    "X-Device-Type": "web",
    "X-App-Version": WEB_APP_VERSION,
    "X-Device-Name": profile.deviceName,
    "X-OS_Version": profile.osVersion,
  }
}
