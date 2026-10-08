import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const products = await getAllProducts(false); // Only published for customers
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
