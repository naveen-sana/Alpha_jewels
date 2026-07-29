/**
 * Decode JWT payload without verification (client-side display only).
 * Backend validates the token on each protected request.
 */
export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null

  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    const payload = JSON.parse(json)

    return {
      email: payload.sub || '',
      role: payload.role || 'USER',
      name: payload.name || '',
      issuedAt: payload.iat ? new Date(payload.iat) : null,
      expiresAt: payload.exp ? new Date(payload.exp) : null,
      isExpired: payload.exp ? Date.now() >= payload.exp : false,
    }
  } catch {
    return null
  }
}

export const isJwtToken = (value) =>
  typeof value === 'string' && value.split('.').length === 3
