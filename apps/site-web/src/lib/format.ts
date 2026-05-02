export function formatUnixDate(value?: number, locale = "en-US") {
  if (!value) {
    return ""
  }

  return new Date(value * 1000).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatUnixDateTime(value?: number | null) {
  if (!value) {
    return ""
  }

  return new Date(value * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatPriceFen(amount?: number, currency = "CNY") {
  if (amount === undefined || amount === null) {
    return ""
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "CNY",
  }).format(amount / 100)
}

export function formatRoleLabel(role?: number) {
  if (role === 5090) {
    return "Admin"
  }
  if (role === 2) {
    return "User"
  }
  if (role === 301) {
    return "SVIP"
  }
  if (role === 3) {
    return "VIP"
  }
  if (role === 1) {
    return "Guest"
  }
  return role ? `Role ${role}` : "Unknown"
}
