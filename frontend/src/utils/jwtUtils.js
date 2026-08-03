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

    const expMs = payload.exp ? (payload.exp > 1e11 ? payload.exp : payload.exp * 1000) : null
    const iatMs = payload.iat ? (payload.iat > 1e11 ? payload.iat : payload.iat * 1000) : null

    return {
      email: payload.sub || '',
      role: payload.role || 'USER',
      name: payload.name || '',
      issuedAt: iatMs ? new Date(iatMs) : null,
      expiresAt: expMs ? new Date(expMs) : null,
      isExpired: expMs ? Date.now() >= expMs : false,
    }
  } catch {
    return null
  }
}

export const isJwtToken = (value) =>
  typeof value === 'string' && value.split('.').length === 3
