import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Add New Product
        </h1>
        <p className="text-xs text-pitstop-400 mt-1">
          Create a new motorcycle accessory, helmet, or lighting item for Bikerz Pitstop.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
