'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getCartWhatsAppUrl } from '@/lib/whatsapp';
import { BUSINESS_CONFIG } from '@/data/business';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalCount, 
    totalPrice, 
    totalMrp, 
    totalSavings, 
    isLoaded 
  } = useCart();

  const handleProceedToWhatsApp = () => {
    if (items.length === 0) return;
    const url = getCartWhatsAppUrl(items);
    window.open(url, '_blank');
    // Note: Do NOT clear the cart automatically, as required by the prompt!
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-pitstop-400">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-8 sm:p-12 text-center space-y-5">
          <div className="w-16 h-16 bg-pitstop-850 rounded-full flex items-center justify-center mx-auto text-pitstop-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Your Cart is Currently Empty
          </h1>
          <p className="text-xs sm:text-sm text-pitstop-300 max-w-md mx-auto">
            You haven&apos;t added any riding gear or accessories yet. Explore our Coimbatore store inventory and add items to generate a WhatsApp inquiry.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="px-6 py-3 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center space-x-2 shadow-lg"
            >
              <span>BROWSE CATALOGUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/helmets"
              className="px-6 py-3 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-pitstop-700 transition-all"
            >
              EXPLORE HELMETS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pitstop-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Shopping Cart ({totalCount} {totalCount === 1 ? 'Item' : 'Items'})
          </h1>
          <p className="text-xs text-pitstop-400 mt-1">
            Review your selected products below. Send your cart to Bikerz Pitstop on WhatsApp to verify in-store stock &amp; confirm dispatch.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-red-400 flex items-center space-x-1.5 transition-colors font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Main Grid: Items List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
            >
              {/* Product Thumbnail */}
              <Link 
                href={`/product/${item.product.slug}`}
                className="relative w-20 h-20 sm:w-24 sm:h-24 bg-pitstop-950 rounded-lg overflow-hidden shrink-0 border border-pitstop-800"
              >
                <Image
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-racing-orange uppercase tracking-wider block">
                  {item.product.brand}
                </span>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="text-sm font-bold text-white hover:text-racing-orange transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>

                {/* Selected variant details */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-pitstop-300">
                  {item.size && (
                    <span className="bg-pitstop-850 px-2 py-0.5 rounded border border-pitstop-700/60">
                      Size: <strong className="text-white">{item.size}</strong>
                    </span>
                  )}
                  {item.colour && (
                    <span className="bg-pitstop-850 px-2 py-0.5 rounded border border-pitstop-700/60">
                      Colour: <strong className="text-white">{item.colour}</strong>
                    </span>
                  )}
                  {item.selectedBike && (
                    <span className="bg-pitstop-850 px-2 py-0.5 rounded border border-pitstop-700/60 text-racing-amber">
                      Bike: <strong>{item.selectedBike}</strong>
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-2 text-sm font-black text-white">
                  {formatPrice(item.price)} each
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-pitstop-800">
                <div className="inline-flex items-center bg-pitstop-850 border border-pitstop-700 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1.5 text-zinc-300 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1.5 text-zinc-300 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-white sm:hidden">
                    Total: {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-pitstop-400 hover:text-red-400 p-1 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 text-xs font-bold text-zinc-300 hover:text-racing-orange transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Cart Summary Card & PROCEED TO WHATSAPP Button */}
        <div className="lg:col-span-1">
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sticky top-28 space-y-6">
            <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-pitstop-800 pb-3">
              Order Summary
            </h3>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-pitstop-300">
                <span>Items ({totalCount})</span>
                <span className="font-mono text-white">{formatPrice(totalPrice)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Catalogue Savings</span>
                  <span className="font-mono">-{formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-pitstop-300">
                <span>In-Store Pickup</span>
                <span className="text-emerald-400 font-bold">FREE (Coimbatore)</span>
              </div>

              <div className="flex justify-between text-pitstop-300">
                <span>Courier / Dispatch</span>
                <span className="text-zinc-300">Calculated on WhatsApp</span>
              </div>

              <div className="pt-3 border-t border-pitstop-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white uppercase">Estimated Total</span>
                <span className="text-2xl font-black text-white font-mono">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Core Action: PROCEED TO WHATSAPP */}
            <button
              onClick={handleProceedToWhatsApp}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2.5 group"
            >
              <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>PROCEED TO WHATSAPP</span>
            </button>

            {/* Informative Note (satisfying prompt constraints) */}
            <div className="bg-pitstop-950 p-4 rounded-xl border border-pitstop-800 space-y-2 text-xs text-pitstop-400">
              <div className="flex items-center space-x-2 text-zinc-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-racing-orange shrink-0" />
                <span>How WhatsApp Ordering Works:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-pitstop-300">
                <li>Your entire cart is converted into a structured message.</li>
                <li>Bikerz Pitstop confirms real-time stock, helmet sizes, and exact fitment.</li>
                <li>Pick up directly at our Ramanathapuram store or arrange all-India courier dispatch.</li>
                <li>Payment is confirmed directly with our store team.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
