export function describeDeviceFromUserAgent(userAgent: string) {
  const normalized = userAgent || ""

  const osVersion = detectOSVersion(normalized)
  const browserName = detectBrowserName(normalized)
  const deviceName = browserName ? `${browserName} on ${osVersion}` : `Web Browser on ${osVersion}`

  return {
    deviceName,
    osVersion,
  }
}

function detectBrowserName(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Microsoft Edge"
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return "Google Chrome"
  if (/Firefox\//i.test(userAgent)) return "Mozilla Firefox"
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari"
  return "Web Browser"
}

function detectOSVersion(userAgent: string) {
  let match = userAgent.match(/Windows NT ([0-9.]+)/i)
  if (match) return `Windows ${match[1]}`

  match = userAgent.match(/Mac OS X ([0-9_]+)/i)
  if (match) return `macOS ${match[1].replace(/_/g, ".")}`

  match = userAgent.match(/Android ([0-9.]+)/i)
  if (match) return `Android ${match[1]}`

  match = userAgent.match(/iPhone OS ([0-9_]+)/i)
  if (match) return `iOS ${match[1].replace(/_/g, ".")}`

  match = userAgent.match(/iPad; CPU OS ([0-9_]+)/i)
  if (match) return `iPadOS ${match[1].replace(/_/g, ".")}`

  match = userAgent.match(/Linux/i)
  if (match) return "Linux"

  return "Unknown OS"
}
