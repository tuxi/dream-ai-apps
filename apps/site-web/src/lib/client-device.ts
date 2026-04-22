import { DEVICE_ID_COOKIE, WEB_APP_VERSION } from "@/lib/device-constants"
import { describeDeviceFromUserAgent } from "@/lib/device-profile"

const DEVICE_ID_STORAGE_KEY = "dreamai_device_id"

export function getClientDeviceHeaders() {
  const deviceId = ensureDeviceId()
  const profile = describeDeviceFromUserAgent(window.navigator.userAgent)

  return {
    "X-Device-ID": deviceId,
    "X-Device-Type": "web",
    "X-App-Version": WEB_APP_VERSION,
    "X-Device-Name": profile.deviceName,
    "X-OS-Version": profile.osVersion,
  }
}

function ensureDeviceId() {
  const fromStorage = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY)
  const fromCookie = readCookie(DEVICE_ID_COOKIE)
  const current = fromStorage || fromCookie

  if (current) {
    syncDeviceId(current)
    return current
  }

  const generated = crypto.randomUUID().replace(/-/g, "")
  syncDeviceId(generated)
  return generated
}

function syncDeviceId(value: string) {
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, value)
  document.cookie = `${DEVICE_ID_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365 * 2}; samesite=lax`
}

function readCookie(name: string) {
  const encoded = `${name}=`
  const items = document.cookie.split(";")
  for (const item of items) {
    const value = item.trim()
    if (value.startsWith(encoded)) {
      return value.slice(encoded.length)
    }
  }
  return ""
}
