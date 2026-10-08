import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { getProductById, updateProduct, deleteProduct } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET: Retrieve single product by ID (Admin)
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

/**
 * PUT: Update product by ID (Admin Only)
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const existing = await getProductById(params.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const mrp = body.mrp !== undefined ? Number(body.mrp) : existing.mrp;
    const stockQuantity = body.stockQuantity !== undefined ? Number(body.stockQuantity) : existing.stockQuantity ?? 10;
    const onOffer = body.onOffer !== undefined ? Boolean(body.onOffer) : existing.onOffer;
    const offerPrice = body.offerPrice !== undefined ? Number(body.offerPrice) : existing.offerPrice;

    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const availability = stockQuantity > 0 ? 'in_stock' : 'out_of_stock';

    const updated = await updateProduct(params.id, {
      ...body,
      price: onOffer && offerPrice ? offerPrice : price,
      mrp,
      stockQuantity,
      availability,
      onOffer,
      offerPrice,
      discountPercent,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error('[ADMIN UPDATE PRODUCT ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete product by ID (Admin Only)
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const success = await deleteProduct(params.id);
  if (!success) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Product deleted permanently' });
}
