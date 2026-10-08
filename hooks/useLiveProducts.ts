'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '@/data/products';

export function useLiveProducts(initialProducts: Product[] = FALLBACK_PRODUCTS) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          setError(null);
        }
      }
    } catch (err: any) {
      console.warn('Live products sync notice: using current cache', err);
      setError(err.message || 'Failed to sync');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, isLoading, error, refresh };
}
