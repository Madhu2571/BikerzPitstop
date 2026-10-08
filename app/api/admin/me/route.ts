import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);

  if (!auth.success) {
    return NextResponse.json(
      { authenticated: false, error: auth.error },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    email: auth.email,
  });
}
