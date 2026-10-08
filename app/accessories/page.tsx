'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bike, Shield, Zap, Compass, MessageCircle } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { BUSINESS_CONFIG } from '@/data/business';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function AccessoriesPage() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');

  const subCategories = [
    'All',
    'Crash Guards',
    'Hand Guards',
    'Mirrors',
    'Levers',
    'Mobile Holders',
    'USB Chargers',
    'Bike Covers',
    'Auxiliary Lights',
    'LED Lights',
    'Radiator Guards',
  ];

  const filteredAccessories = useMemo(() => {
    return liveProducts.filter((product) => {
      // Must be Motorcycle Accessories OR Lighting
      if (product.category === 'Helmets') return false;
      if (activeSubCategory !== 'All' && product.subCategory !== activeSubCategory) return false;
      return true;
    });
  }, [liveProducts, activeSubCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-racing-orange/10 border border-racing-orange/30 text-racing-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Bike className="w-3.5 h-3.5" />
            <span>Heavy-Duty Protection &amp; Electronics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Motorcycle Accessories &amp; Touring Gear
          </h1>
          <p className="text-xs sm:text-sm text-pitstop-300 mt-3 max-w-2xl leading-relaxed">
            Protect your engine, bars, and bodywork while upgrading cockpit ergonomics. From laser-cut crash cages to vibration-damped phone mounts and Maddog night blasters.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/shop-by-bike"
              className="px-5 py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Filter Accessories by Your Bike Model</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subcategory Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {subCategories.map((sub) => {
          const count = sub === 'All' 
            ? PRODUCTS.filter((p) => p.category !== 'Helmets').length
            : PRODUCTS.filter((p) => p.subCategory === sub).length;

          return (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeSubCategory === sub
                  ? 'bg-racing-orange text-black'
                  : 'bg-pitstop-900 text-zinc-300 hover:bg-pitstop-850 border border-pitstop-800'
              }`}
            >
              {sub} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 text-xs text-pitstop-400">
          <span>Showing {filteredAccessories.length} motorcycle accessories</span>
        </div>

        {filteredAccessories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAccessories.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-10 text-center">
            <p className="text-zinc-400 text-sm">No accessories found in this subcategory.</p>
            <button
              onClick={() => setActiveSubCategory('All')}
              className="mt-3 text-xs text-racing-orange hover:underline font-bold"
            >
              View All Accessories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
