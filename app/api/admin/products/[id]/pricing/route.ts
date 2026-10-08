import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { updatePriceAndOffer } from '@/lib/products-store';

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
    const { price, mrp, onOffer, offerPrice } = body;

    if (price === undefined || mrp === undefined) {
      return NextResponse.json(
        { success: false, error: 'Price and MRP are required' },
        { status: 400 }
      );
    }

    const updated = await updatePriceAndOffer(params.id, {
      price: Number(price),
      mrp: Number(mrp),
      onOffer: Boolean(onOffer),
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing and offer details updated successfully',
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update pricing' },
      { status: 500 }
    );
  }
}
