import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { updateStock } from '@/lib/products-store';

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
    const { stockQuantity } = body;

    if (stockQuantity === undefined || isNaN(Number(stockQuantity))) {
      return NextResponse.json(
        { success: false, error: 'Valid stockQuantity is required' },
        { status: 400 }
      );
    }

    const updated = await updateStock(params.id, Number(stockQuantity));
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Stock updated to ${updated.stockQuantity} (${updated.availability})`,
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}
