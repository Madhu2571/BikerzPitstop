'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  Check, 
  RotateCcw,
  Zap,
  CloudRain,
  Shield,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import { formatPrice, getEmergencyKitWhatsAppUrl, getOutOfStockWhatsAppUrl } from '@/lib/whatsapp';
import { Product } from '@/types';

// Rationale for why each emergency product is critical
const EMERGENCY_RATIONALE: Record<string, string> = {
  'bp-moto-16': 'Permanently plugs punctures in tubeless tyres without removing the wheel rim in under 5 minutes on remote highways.',
  'bp-moto-17': 'Rechargeable 4000mAh electric inflator with auto-stop and SOS strobe. Fills motorcycle tyres without searching for roadside pumps.',
  'bp-moto-18': 'High-tensile CR-V steel tool with hex keys and sockets to fix loose mirrors, chain slack, levers, and fairing bolts roadside.',
  'bp-moto-13': 'Keeps your phone GPS alive during highway detours and features a live digital voltmeter to monitor motorcycle battery health.',
  'bp-moto-14': '100% waterproof heavy-duty cover protects sensitive electrical switchgear and instrument displays from monsoon downpours.',
  'bp-moto-11': 'Vibration-damped metal mount secures your smartphone for emergency hands-free navigation without camera sensor damage.',
  'bp-light-01': 'Pierces dense fog, pouring rain, and pitch-black highway stretches where stock motorcycle headlights fail.',
  'bp-acc-01': 'Zero-fog moisture barrier lens ensures 100% clear vision during sudden rain showers and cold morning mountain rides.',
};

export default function EmergencyKitPage() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const { addToCart } = useCart();

  // Find actual products in live catalog that serve emergency/safety roles
  const emergencyProducts = useMemo(() => {
    const emergencyIds = [
      'bp-moto-16', // Puncture kit
      'bp-moto-17', // Mini inflator
      'bp-moto-18', // 16-in-1 tool
      'bp-moto-13', // Fast charger & voltmeter
      'bp-moto-14', // Waterproof cover
      'bp-moto-11', // Mobile holder
      'bp-light-01', // Aux fog lights
      'bp-acc-01',  // Anti-fog Pinlock
    ];

    return liveProducts.filter((p) => emergencyIds.includes(p.id));
  }, [liveProducts]);

  // Default preselected essentials (Puncture kit, inflator, multitool)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'bp-moto-16',
    'bp-moto-17',
    'bp-moto-18',
  ]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Selected products list
  const selectedProducts = useMemo(() => {
    return emergencyProducts.filter((p) => selectedIds.includes(p.id));
  }, [emergencyProducts, selectedIds]);

  // Totals
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.price, 0);
  }, [selectedProducts]);

  const totalMrp = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + (p.mrp || p.price), 0);
  }, [selectedProducts]);

  const totalSavings = totalMrp - totalAmount;

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Quick preset kit buttons
  const applyPreset = (preset: 'highway' | 'monsoon' | 'complete') => {
    if (preset === 'highway') {
      setSelectedIds(['bp-moto-16', 'bp-moto-17', 'bp-moto-18']);
    } else if (preset === 'monsoon') {
      setSelectedIds(['bp-moto-14', 'bp-acc-01', 'bp-moto-13']);
    } else if (preset === 'complete') {
      setSelectedIds(emergencyProducts.map((p) => p.id));
    }
  };

  // Add kit to cart
  const handleAddKitToCart = () => {
    if (selectedProducts.length === 0) return;
    selectedProducts.forEach((p) => {
      addToCart(p, { quantity: 1 });
    });
    setAddedToast(`Added ${selectedProducts.length} emergency kit essentials to your cart!`);
    setTimeout(() => setAddedToast(null), 4000);
  };

  // WhatsApp order URL
  const whatsappUrl = useMemo(() => {
    return getEmergencyKitWhatsAppUrl({
      items: selectedProducts.map((p) => ({
        name: p.name,
        price: p.price,
      })),
      totalAmount,
    });
  }, [selectedProducts, totalAmount]);

  return (
    <div className="min-h-screen bg-pitstop-950 text-white pb-24">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-pitstop-900 border-b border-pitstop-800 py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-4 border border-red-800/60">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Highway &amp; Tourer Readiness</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Emergency <span className="text-red-500">Rider Kit</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-pitstop-300 leading-relaxed">
              Don&apos;t get stranded on remote Tamil Nadu highways, Ghat passes, or during sudden monsoon cloudbursts. Build your customized roadside emergency kit with genuine, field-proven motorcycle gear.
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="mt-8 pt-6 border-t border-pitstop-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-pitstop-400 font-bold uppercase tracking-wider mr-2">Quick Presets:</span>
            
            <button
              onClick={() => applyPreset('highway')}
              className="px-4 py-2 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold border border-pitstop-700 hover:border-racing-orange transition-all flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-racing-orange" />
              <span>Highway Puncture Kit (3 items)</span>
            </button>

            <button
              onClick={() => applyPreset('monsoon')}
              className="px-4 py-2 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold border border-pitstop-700 hover:border-blue-400 transition-all flex items-center space-x-1.5"
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Monsoon Commute Kit (3 items)</span>
            </button>

            <button
              onClick={() => applyPreset('complete')}
              className="px-4 py-2 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold border border-pitstop-700 hover:border-emerald-400 transition-all flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Highway Essentials</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Actual Emergency Products */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                <span>Select Emergency Gear to Include in Your Kit</span>
              </h3>
              <span className="text-xs text-pitstop-400">
                {selectedProducts.length} of {emergencyProducts.length} selected
              </span>
            </div>

            <div className="space-y-4">
              {emergencyProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const isOutOfStock = product.availability === 'out_of_stock' || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
                const whyUseful = EMERGENCY_RATIONALE[product.id] || product.description;

                return (
                  <div
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-pitstop-900 border-red-500/80 shadow-lg shadow-red-950/20'
                        : 'bg-pitstop-900/60 border-pitstop-800 hover:border-pitstop-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Checkbox + Image + Details */}
                    <div className="flex items-start space-x-4 min-w-0">
                      {/* Custom Checkbox */}
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-red-600 border-red-500 text-white'
                              : 'bg-pitstop-800 border-pitstop-700 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>

                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-pitstop-950 rounded-xl overflow-hidden shrink-0 border border-pitstop-800">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : null}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-pitstop-400">
                          <span className="text-racing-orange">{product.brand}</span>
                          <span>•</span>
                          <span>{product.subCategory}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                          {product.name}
                        </h4>

                        {/* Why It Is Useful Box */}
                        <div className="mt-2 p-2.5 rounded-lg bg-pitstop-950/80 border border-pitstop-800 text-xs text-pitstop-300">
                          <span className="text-red-400 font-bold mr-1">Why it&apos;s critical:</span>
                          <span>{whyUseful}</span>
                        </div>

                        {/* Stock indicator */}
                        <div className="mt-2 text-xs">
                          {isOutOfStock ? (
                            <span className="text-red-400 font-semibold">Out of Stock at Coimbatore Shop</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                              <span>In Stock for Immediate Dispatch</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-pitstop-800 flex sm:flex-col items-center sm:items-end justify-between">
                      <div>
                        <div className="text-lg font-black text-white">{formatPrice(product.price)}</div>
                        {product.mrp > product.price && (
                          <div className="text-xs text-pitstop-400 line-through">{formatPrice(product.mrp)}</div>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-racing-orange mt-1">
                        {isSelected ? '✓ Included in Kit' : '+ Click to Add'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (4 cols): Kit Summary & Ordering */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-5 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-pitstop-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                    Custom Roadside Setup
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    Emergency Kit Summary
                  </h3>
                </div>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-xs text-pitstop-400 hover:text-red-400 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="py-3 max-h-64 overflow-y-auto space-y-2 divide-y divide-pitstop-800/60 pr-1">
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 text-pitstop-400">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-pitstop-600" />
                    <p className="text-xs font-semibold">Your kit is empty.</p>
                    <p className="text-[11px] text-pitstop-500 mt-0.5">
                      Select items from the left or choose a Quick Preset above.
                    </p>
                  </div>
                ) : (
                  selectedProducts.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="pr-2 min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-pitstop-400">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProduct(item.id);
                        }}
                        className="text-pitstop-500 hover:text-red-400 text-[11px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-pitstop-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-pitstop-300">
                  <span>Kit Items</span>
                  <span className="font-bold text-white">{selectedProducts.length} essentials</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Kit Savings</span>
                    <span className="font-bold">-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-pitstop-800">
                  <span>Total Kit Price</span>
                  <span className="text-red-400 text-lg">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    selectedProducts.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      : 'bg-pitstop-800 text-pitstop-500 pointer-events-none cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order Emergency Kit on WhatsApp</span>
                </a>

                <button
                  onClick={handleAddKitToCart}
                  disabled={selectedProducts.length === 0}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all border ${
                    selectedProducts.length > 0
                      ? 'bg-pitstop-800 hover:bg-pitstop-750 text-white border-pitstop-700'
                      : 'bg-pitstop-850 text-pitstop-600 border-pitstop-800 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-racing-orange" />
                  <span>Add Entire Kit to Cart</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-pitstop-800 text-[11px] text-pitstop-400">
                ⚡ Prepared at Bikerz Pitstop, Coimbatore. In-store collection or express courier available across Tamil Nadu &amp; South India.
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
