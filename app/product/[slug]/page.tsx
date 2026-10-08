import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { BUSINESS_CONFIG } from '@/data/business';
import ProductDetailView from '@/components/ProductDetailView';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
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

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
