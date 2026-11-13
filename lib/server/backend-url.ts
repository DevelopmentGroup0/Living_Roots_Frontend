export function getBackendUrl(path: string): string {
  const baseUrl =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL

  if (!baseUrl) {
    throw new Error(
      'BACKEND_URL or NEXT_PUBLIC_BACKEND_URL must be configured'
    )
  }

  return new URL(path.replace(/^\/+/, ''), `${baseUrl.replace(/\/+$/, '')}/`)
    .toString()
}
