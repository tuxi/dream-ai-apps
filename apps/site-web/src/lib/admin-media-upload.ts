import type { AdminMediaStsResponse } from "@/lib/api/site-admin"

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

function toBase64(input: string) {
  return btoa(unescape(encodeURIComponent(input)))
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

async function signPolicy(secret: string, policyBase64: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(policyBase64))
  return arrayBufferToBase64(signature)
}

function normalizeDir(dir: string) {
  if (!dir) {
    return ""
  }
  return dir.endsWith("/") ? dir : `${dir}/`
}

function buildObjectKey(dir: string, file: File) {
  const normalizedDir = normalizeDir(dir)
  const extension = file.name.includes(".") ? `.${file.name.split(".").pop()}` : ""
  const safeName = `${Date.now()}-${crypto.randomUUID().replace(/-/g, "")}${extension}`
  return `${normalizedDir}${safeName}`
}

function buildPolicy(dir: string, expiration: string) {
  const expireAt = new Date(expiration)
  const safeExpiration = Number.isNaN(expireAt.getTime())
    ? new Date(Date.now() + 5 * 60 * 1000).toISOString()
    : new Date(Math.min(expireAt.getTime(), Date.now() + 5 * 60 * 1000)).toISOString()

  return {
    expiration: safeExpiration,
    conditions: [
      ["starts-with", "$key", normalizeDir(dir)],
      ["content-length-range", 0, MAX_UPLOAD_BYTES],
      { success_action_status: "200" },
    ],
  }
}

function buildPublicUrl(host: string, objectKey: string) {
  const normalizedHost = host.replace(/\/$/, "")
  return `${normalizedHost}/${objectKey}`
}

export async function uploadFileToAdminMedia(sts: AdminMediaStsResponse, file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("文件不能超过 20MB。")
  }

  const objectKey = buildObjectKey(sts.dir, file)
  const policy = buildPolicy(sts.dir, sts.expiration)
  const policyBase64 = toBase64(JSON.stringify(policy))
  const signature = await signPolicy(sts.access_key_secret, policyBase64)

  const formData = new FormData()
  formData.append("key", objectKey)
  formData.append("policy", policyBase64)
  formData.append("OSSAccessKeyId", sts.access_key_id)
  formData.append("Signature", signature)
  formData.append("x-oss-security-token", sts.security_token)
  formData.append("success_action_status", "200")
  formData.append("file", file)

  const response = await fetch(sts.host, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`上传失败：${response.status}`)
  }

  return {
    objectKey,
    url: buildPublicUrl(sts.host, objectKey),
  }
}
