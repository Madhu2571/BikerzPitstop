import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmail, getAdminPassword, signAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const approvedEmail = getAdminEmail();
    const approvedPassword = getAdminPassword();

    const normalizedInputEmail = String(email).trim().toLowerCase();

    // STRICT SERVER-SIDE AUTHORIZATION CHECK
    // Only the exact approved admin email is allowed access
    if (normalizedInputEmail !== approvedEmail) {
      console.warn(`[UNAUTHORIZED ATTEMPT] Access denied for email: ${normalizedInputEmail}`);
      return NextResponse.json(
        { success: false, error: 'Access denied: You are not authorized as an administrator.' },
        { status: 403 }
      );
    }

    // Verify Password
    if (password !== approvedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Generate secure token
    const token = await signAdminToken(approvedEmail);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      email: approvedEmail,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('[ADMIN LOGIN ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
