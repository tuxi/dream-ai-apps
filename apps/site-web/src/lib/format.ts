export function formatUnixDate(value?: number) {
  if (!value) {
    return ""
  }

  return new Date(value * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
