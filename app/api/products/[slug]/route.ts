import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await getProductBySlug(params.slug, false);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }
    return NextResponse.json(
      { success: true, product },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}
