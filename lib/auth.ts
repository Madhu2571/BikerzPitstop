import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'bikerz_admin_session';

// Approved Admin Configuration (Server-side ONLY)
export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || 'admin@bikerzpitstop.com').trim().toLowerCase();
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_SESSION_SECRET || 'bikerz_default_session_secret_replace_in_env';
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT for the authenticated admin
 */
export async function signAdminToken(email: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const token = await new SignJWT({ email: normalizedEmail, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
  return token;
}

/**
 * Verifies a JWT token and ensures it belongs to the exact approved admin email
 */
export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const email = (payload.email as string)?.trim().toLowerCase();
    const approvedEmail = getAdminEmail();

    // Strict Server-Side Authorization Check
    if (email !== approvedEmail) {
      console.warn(`[AUTH REJECTED] Token email "${email}" does not match approved admin email "${approvedEmail}"`);
      return null;
    }

    return {
      email,
      role: 'admin',
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Server-side helper to verify incoming API request has a valid admin session
 */
export async function verifyAdminRequest(request: Request | NextRequest): Promise<{
  success: boolean;
  email?: string;
  error?: string;
}> {
  let token: string | undefined;

  // Extract from Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  token = cookies[ADMIN_COOKIE_NAME];

  // Also check Authorization: Bearer <token>
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return { success: false, error: 'Unauthorized: Authentication required' };
  }

  const session = await verifyAdminToken(token);
  if (!session) {
    return { success: false, error: 'Unauthorized: Invalid or expired admin session' };
  }

  return { success: true, email: session.email };
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}
