'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { Product } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setError('Product not found');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load product');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-racing-orange animate-spin" />
        <span className="text-xs text-pitstop-400">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-lg font-black text-white uppercase">Product Not Found</h2>
        <p className="text-xs text-pitstop-400">
          The requested product could not be loaded or was deleted.
        </p>
        <button
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 bg-racing-orange text-black font-bold text-xs uppercase rounded-lg"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Edit Product: <span className="text-racing-orange">{product.name}</span>
        </h1>
        <p className="text-xs text-pitstop-400 mt-1">
          Modify pricing, stock quantities, images, specifications, or motorcycle compatibility.
        </p>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
