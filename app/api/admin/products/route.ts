import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { getAllProducts, createProduct } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

/**
 * GET: Returns all products including unpublished for admin dashboard
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const products = await getAllProducts(true); // true = include unpublished
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new product (Admin Only)
 */
export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.brand || !body.category || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields: name, brand, category, price' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const stock = Number(body.stockQuantity ?? 10);
    const price = Number(body.price);
    const mrp = Number(body.mrp || price);
    const onOffer = Boolean(body.onOffer);
    const offerPrice = body.offerPrice ? Number(body.offerPrice) : price;

    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const newProduct = await createProduct({
      slug,
      name: body.name.trim(),
      brand: body.brand.trim(),
      category: body.category,
      subCategory: body.subCategory || 'Other',
      price: onOffer ? offerPrice : price,
      mrp,
      images: Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      description: body.description || '',
      specifications: body.specifications || {},
      compatibleBikes: Array.isArray(body.compatibleBikes) && body.compatibleBikes.length > 0 
        ? body.compatibleBikes 
        : ['Universal'],
      sizes: body.sizes || [],
      colours: body.colours || [],
      availability: stock > 0 ? 'in_stock' : 'out_of_stock',
      stockQuantity: stock,
      published: body.published !== false,
      onOffer,
      offerPrice,
      discountPercent,
      featured: Boolean(body.featured),
      newArrival: Boolean(body.newArrival),
      popular: Boolean(body.popular),
      badge: body.badge || undefined,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    console.error('[ADMIN CREATE PRODUCT ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
