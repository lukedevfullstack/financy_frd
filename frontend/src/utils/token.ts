/**
 * Decode a JWT token without verifying the signature
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp || typeof decoded.exp !== "number") {
    return true;
  }

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

/**
 * Get token expiration time
 * @param token - The JWT token string
 * @returns Expiration date or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp || typeof decoded.exp !== "number") {
    return null;
  }

  return new Date(decoded.exp * 1000);
}

/**
 * Get time remaining until token expiration
 * @param token - The JWT token string
 * @returns Time remaining in milliseconds, or 0 if expired/invalid
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp || typeof decoded.exp !== "number") {
    return 0;
  }

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;

  return remaining > 0 ? remaining : 0;
}
