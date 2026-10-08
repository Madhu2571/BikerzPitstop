import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { updateProduct } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: any = {};

    if (body.published !== undefined) {
      updates.published = Boolean(body.published);
    }
    if (body.featured !== undefined) {
      updates.featured = Boolean(body.featured);
    }
    if (body.newArrival !== undefined) {
      updates.newArrival = Boolean(body.newArrival);
    }
    if (body.popular !== undefined) {
      updates.popular = Boolean(body.popular);
    }

    const updated = await updateProduct(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product visibility flags updated successfully',
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update visibility' },
      { status: 500 }
    );
  }
}
