'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Ruler, ArrowRight, MessageCircle } from 'lucide-react';
import { PRODUCTS, HELMET_TYPES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { BUSINESS_CONFIG } from '@/data/business';

export default function HelmetsPage() {
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');
  const [activeBrand, setActiveBrand] = useState<string>('All');

  const helmetBrands = ['All', 'Axor', 'MT Helmets', 'SMK', 'LS2'];

  const filteredHelmets = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (product.category !== 'Helmets') return false;
      if (activeSubCategory !== 'All' && product.subCategory !== activeSubCategory) return false;
      if (activeBrand !== 'All' && product.brand !== activeBrand) return false;
      return true;
    });
  }, [activeSubCategory, activeBrand]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-racing-orange/10 border border-racing-orange/30 text-racing-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Certified Motorcycle Helmets</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Premium Helmets in Coimbatore
          </h1>
          <p className="text-xs sm:text-sm text-pitstop-300 mt-3 max-w-2xl leading-relaxed">
            From world-class ECE 22.06 certified track lids to rugged adventure tourers and classic open-face helmets. Visit Bikerz Pitstop for authentic fitment, trial &amp; visor personalization.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent("Hi Bikerz Pitstop 👋 I need help choosing the right helmet size and model. Could you please advise me?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask Helmet Expert on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sizing Reference Guide Accordion / Bar */}
      <div className="bg-pitstop-950 border border-pitstop-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-white font-bold text-sm uppercase mb-3">
          <Ruler className="w-4 h-4 text-racing-orange" />
          <span>Quick Helmet Sizing Chart (Head Circumference)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-pitstop-900 p-3 rounded-lg border border-pitstop-800">
            <span className="text-racing-orange font-black text-sm block">S (Small)</span>
            <span className="text-zinc-300">55 - 56 cm</span>
          </div>
          <div className="bg-pitstop-900 p-3 rounded-lg border border-pitstop-800">
            <span className="text-racing-orange font-black text-sm block">M (Medium)</span>
            <span className="text-zinc-300">57 - 58 cm</span>
          </div>
          <div className="bg-pitstop-900 p-3 rounded-lg border border-pitstop-800">
            <span className="text-racing-orange font-black text-sm block">L (Large)</span>
            <span className="text-zinc-300">59 - 60 cm</span>
          </div>
          <div className="bg-pitstop-900 p-3 rounded-lg border border-pitstop-800">
            <span className="text-racing-orange font-black text-sm block">XL (X-Large)</span>
            <span className="text-zinc-300">61 - 62 cm</span>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubCategory('All')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeSubCategory === 'All'
                ? 'bg-racing-orange text-black'
                : 'bg-pitstop-900 text-zinc-300 hover:bg-pitstop-850 border border-pitstop-800'
            }`}
          >
            All Helmet Gear ({PRODUCTS.filter(p => p.category === 'Helmets').length})
          </button>
          {HELMET_TYPES.map((type) => {
            const count = PRODUCTS.filter((p) => p.category === 'Helmets' && p.subCategory === type).length;
            return (
              <button
                key={type}
                onClick={() => setActiveSubCategory(type)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeSubCategory === type
                    ? 'bg-racing-orange text-black'
                    : 'bg-pitstop-900 text-zinc-300 hover:bg-pitstop-850 border border-pitstop-800'
                }`}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>

        {/* Brand Filter row */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-pitstop-400 font-bold uppercase tracking-wider">Brand:</span>
          {helmetBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeBrand === brand
                  ? 'bg-pitstop-800 text-racing-orange font-bold border border-racing-orange/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 text-xs text-pitstop-400">
          <span>Showing {filteredHelmets.length} helmets &amp; accessories</span>
        </div>

        {filteredHelmets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredHelmets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-10 text-center">
            <p className="text-zinc-400 text-sm">No helmets matching this specific filter.</p>
            <button
              onClick={() => { setActiveSubCategory('All'); setActiveBrand('All'); }}
              className="mt-3 text-xs text-racing-orange hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
