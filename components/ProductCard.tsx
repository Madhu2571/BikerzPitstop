'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getOutOfStockWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.availability === 'out_of_stock';
  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default select first size or color if available
    addToCart(product, {
      size: product.sizes?.[0],
      colour: product.colours?.[0],
      selectedBike: product.compatibleBikes[0] !== 'Universal' ? product.compatibleBikes[0] : undefined,
      quantity: 1,
    });
  };

  const handleOutOfStockWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getOutOfStockWhatsAppUrl(product), '_blank');
  };

  return (
    <div className="group bg-pitstop-900 border border-pitstop-800 hover:border-pitstop-600 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      {/* Image container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-pitstop-950 overflow-hidden">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="bg-racing-orange text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-pitstop-950/90 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Stock status overlay tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center text-[10px] font-bold bg-red-950/90 text-red-400 border border-red-800/80 px-2 py-0.5 rounded backdrop-blur-sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              OUT OF STOCK
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] font-bold bg-pitstop-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
              IN STOCK
            </span>
          )}
        </div>
      </Link>

      {/* Content info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-pitstop-400 mb-1">
            <span className="text-racing-orange">{product.brand}</span>
            <span>{product.subCategory}</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-white group-hover:text-racing-orange transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Compatible bike preview */}
          <div className="mt-2 text-[11px] text-pitstop-400">
            {product.compatibleBikes.includes('Universal') ? (
              <span className="text-zinc-400">Universal Fit (All Bikes)</span>
            ) : (
              <span className="text-racing-amber line-clamp-1">
                Fits: {product.compatibleBikes.slice(0, 2).join(', ')}
                {product.compatibleBikes.length > 2 ? ` +${product.compatibleBikes.length - 2} more` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-pitstop-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-pitstop-500 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            {product.rating && (
              <span className="text-[11px] text-amber-400 font-bold flex items-center">
                ★ {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          {isOutOfStock ? (
            <button
              onClick={handleOutOfStockWhatsApp}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-pitstop-800 hover:bg-emerald-700 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-pitstop-700 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask Availability</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center justify-center space-x-1 py-2 px-2 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-lg border border-pitstop-700/80 transition-colors"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={handleQuickAdd}
                className="flex items-center justify-center space-x-1 py-2 px-2 bg-racing-orange hover:bg-racing-amber text-black text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-md transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
