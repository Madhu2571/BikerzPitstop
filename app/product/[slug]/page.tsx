import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/products-store';
import { BUSINESS_CONFIG } from '@/data/business';
import ProductDetailView from '@/components/ProductDetailView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug, true);
  if (!product) {
    return {
      title: `Product Not Found | ${BUSINESS_CONFIG.name}`,
    };
  }

  return {
    title: `${product.name} | ${BUSINESS_CONFIG.name} Coimbatore`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${BUSINESS_CONFIG.name}`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug, false);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts(false);
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
