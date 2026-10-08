'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Wrench, 
  Bike, 
  CheckCircle2, 
  ShoppingBag, 
  MessageCircle, 
  Plus, 
  Trash2, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { POPULAR_BIKE_BRANDS } from '@/data/bikes';
import { PRODUCTS } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import { formatPrice, getBuildMyBikeWhatsAppUrl } from '@/lib/whatsapp';
import { Product } from '@/types';

// Zones of motorcycle accessory mounting
interface AccessoryZone {
  id: string;
  name: string;
  iconLabel: string;
  subCategories: string[];
  description: string;
}

const ZONES: AccessoryZone[] = [
  {
    id: 'cockpit',
    name: 'Handlebar & Controls',
    iconLabel: 'Cockpit',
    subCategories: ['Mobile Holders', 'USB Chargers', 'Mirrors', 'Levers', 'Bar Ends', 'Hand Guards'],
    description: 'Navigation mounts, rapid chargers, ergonomic CNC levers, stealth bar-end mirrors.',
  },
  {
    id: 'lighting',
    name: 'Front & Auxiliary Lighting',
    iconLabel: 'Front',
    subCategories: ['Auxiliary Lights', 'LED Lights', 'Indicators', 'Electrical Accessories'],
    description: 'High-power fog lights, LED headlight upgrades, and wiring harness switchgear.',
  },
  {
    id: 'frame',
    name: 'Engine & Crash Protection',
    iconLabel: 'Chassis',
    subCategories: ['Crash Guards', 'Radiator Guards'],
    description: 'Heavy gauge steel crash guards, sacrificial sliders, and radiator fin armour.',
  },
  {
    id: 'ergonomics',
    name: 'Footwork & Riding Ergo',
    iconLabel: 'Footwork',
    subCategories: ['Footrests'],
    description: 'Wide adventure touring footpegs with vibration isolating rubber.',
  },
  {
    id: 'safety',
    name: 'Roadside & Parking Protection',
    iconLabel: 'Parking',
    subCategories: ['Bike Covers', 'Emergency & Tools'],
    description: '100% waterproof all-weather covers, tubeless puncture guns, mini electric inflators.',
  },
];

export default function BuildMyBikePage() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const { addToCart } = useCart();

  const [selectedBrand, setSelectedBrand] = useState<string>('Royal Enfield');
  const [selectedModel, setSelectedModel] = useState<string>('Himalayan 450');
  const [activeZoneId, setActiveZoneId] = useState<string>('cockpit');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Available models for currently chosen brand
  const currentBrandData = POPULAR_BIKE_BRANDS.find((b) => b.brand === selectedBrand);
  const availableModels = currentBrandData?.models || [];

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    const brandData = POPULAR_BIKE_BRANDS.find((b) => b.brand === brand);
    if (brandData && brandData.models.length > 0) {
      setSelectedModel(brandData.models[0]);
    } else {
      setSelectedModel('');
    }
  };

  // Filter products compatible with the selected bike
  const compatibleProducts = useMemo(() => {
    if (!selectedModel) return [];

    const normModel = selectedModel.toLowerCase().replace(/[\s\-_()]/g, '');

    return liveProducts.filter((p) => {
      // Exclude helmets from bike build rig (helmets are rider gear)
      if (p.category === 'Helmets' && p.subCategory !== 'Helmet Accessories') return false;

      const bikeList = p.compatibleBikes || [];
      const isUniversal = bikeList.some((b) => b.toLowerCase() === 'universal');
      const isDirectMatch = bikeList.some((b) => {
        const normB = b.toLowerCase().replace(/[\s\-_()]/g, '');
        return normB === normModel || normModel.includes(normB) || normB.includes(normModel);
      });

      return isDirectMatch || isUniversal;
    });
  }, [liveProducts, selectedModel]);

  // Products belonging to the active zone
  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  const zoneProducts = useMemo(() => {
    return compatibleProducts.filter((p) => activeZone.subCategories.includes(p.subCategory));
  }, [compatibleProducts, activeZone]);

  // Selected products details
  const selectedProducts = useMemo(() => {
    return liveProducts.filter((p) => selectedProductIds.includes(p.id));
  }, [liveProducts, selectedProductIds]);

  // Setup Totals
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.price, 0);
  }, [selectedProducts]);

  const totalMrp = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + (p.mrp || p.price), 0);
  }, [selectedProducts]);

  const totalSavings = totalMrp - totalAmount;

  // Toggle selection
  const toggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  // Add all selected products to cart
  const handleAddAllToCart = () => {
    if (selectedProducts.length === 0) return;
    selectedProducts.forEach((p) => {
      addToCart(p, { quantity: 1, selectedBike: `${selectedBrand} ${selectedModel}` });
    });
    setAddedToast(`Added ${selectedProducts.length} accessories to your cart!`);
    setTimeout(() => setAddedToast(null), 4000);
  };

  // WhatsApp setup order URL
  const whatsappUrl = useMemo(() => {
    return getBuildMyBikeWhatsAppUrl({
      bikeModel: `${selectedBrand} ${selectedModel}`,
      items: selectedProducts.map((p) => ({
        name: p.name,
        price: p.price,
        quantity: 1,
        category: p.subCategory,
      })),
      totalAmount,
    });
  }, [selectedBrand, selectedModel, selectedProducts, totalAmount]);

  return (
    <div className="min-h-screen bg-pitstop-950 text-white pb-24">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-pitstop-900 border-b border-pitstop-800 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pitstop-800 text-racing-orange text-xs font-bold uppercase tracking-wider mb-4 border border-pitstop-700">
              <Wrench className="w-3.5 h-3.5" />
              <span>Interactive Rig Builder</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Build <span className="text-racing-orange">My Bike</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-pitstop-300 leading-relaxed">
              Design your custom motorcycle build zone-by-zone. Choose genuine accessories compatible with your exact bike model, review live pricing, and send the complete build directly to Bikerz Pitstop on WhatsApp.
            </p>
          </div>

          {/* Bike Selection Bar */}
          <div className="mt-8 bg-pitstop-850 border border-pitstop-700/80 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-3 flex items-center justify-between">
              <span>Step 1: Choose Your Motorcycle Base</span>
              <span className="text-xs text-racing-orange">
                {compatibleProducts.length} verified parts available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Motorcycle Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-racing-orange font-medium"
                >
                  {POPULAR_BIKE_BRANDS.map((b) => (
                    <option key={b.brand} value={b.brand}>
                      {b.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Motorcycle Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-racing-orange font-medium"
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Interactive Zones + Accessory Selection */}
          <div className="lg:col-span-8 space-y-6">

            {/* Interactive Visual Motorcycle Blueprint Representation */}
            <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                    <Bike className="w-4 h-4 text-racing-orange" />
                    <span>Visual Motorcycle Blueprint: {selectedBrand} {selectedModel}</span>
                  </h3>
                  <p className="text-xs text-pitstop-400 mt-0.5">
                    Select a mounting zone below to explore parts designed for that position.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-pitstop-800 text-pitstop-300 border border-pitstop-700">
                  Step 2: Configure Zones
                </span>
              </div>

              {/* Motorcycle Layout Zones Navigation */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {ZONES.map((zone) => {
                  const isActive = zone.id === activeZoneId;
                  const zoneSelectedCount = selectedProducts.filter((p) =>
                    zone.subCategories.includes(p.subCategory)
                  ).length;

                  return (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZoneId(zone.id)}
                      className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'bg-racing-orange/15 border-racing-orange text-white shadow-lg shadow-racing-orange/10'
                          : 'bg-pitstop-850 hover:bg-pitstop-800 border-pitstop-700 text-pitstop-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-racing-orange' : 'text-pitstop-400'}`}>
                          {zone.iconLabel}
                        </span>
                        {zoneSelectedCount > 0 && (
                          <span className="bg-racing-orange text-black font-black text-[10px] px-1.5 py-0.2 rounded-full">
                            {zoneSelectedCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {zone.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Zone Details Card */}
              <div className="mt-4 p-3.5 bg-pitstop-950/70 border border-pitstop-800 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-racing-orange font-bold mr-1.5">Zone Focus:</span>
                  <span className="text-zinc-200 font-semibold">{activeZone.name}</span>
                  <span className="text-pitstop-400 hidden sm:inline ml-2">— {activeZone.description}</span>
                </div>
                <span className="text-pitstop-400 text-[11px] font-mono shrink-0 ml-2">
                  {zoneProducts.length} options
                </span>
              </div>
            </div>

            {/* Zone Products List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-racing-orange" />
                  <span>Compatible Accessories for {activeZone.name}</span>
                </h3>
              </div>

              {zoneProducts.length === 0 ? (
                <div className="text-center py-12 bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6">
                  <Info className="w-8 h-8 text-pitstop-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">
                    No accessories currently catalogued for this zone on {selectedModel}.
                  </p>
                  <p className="text-xs text-pitstop-400 mt-1">
                    Try another zone or request custom fabrication through WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {zoneProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    const isOutOfStock = product.availability === 'out_of_stock' || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);

                    return (
                      <div
                        key={product.id}
                        className={`bg-pitstop-900 rounded-xl border p-4 flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-racing-orange ring-1 ring-racing-orange/50 bg-pitstop-850'
                            : 'border-pitstop-800 hover:border-pitstop-700'
                        }`}
                      >
                        <div className="flex space-x-3.5">
                          <div className="relative w-20 h-20 bg-pitstop-950 rounded-lg overflow-hidden shrink-0 border border-pitstop-800">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : null}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-racing-orange uppercase tracking-wider">
                              {product.brand} • {product.subCategory}
                            </div>
                            <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                              {product.name}
                            </h4>
                            <div className="mt-1 flex items-baseline space-x-2">
                              <span className="text-sm font-black text-white">{formatPrice(product.price)}</span>
                              {product.mrp > product.price && (
                                <span className="text-[11px] text-pitstop-400 line-through">{formatPrice(product.mrp)}</span>
                              )}
                            </div>
                            
                            {/* Stock Indicator */}
                            <div className="mt-1 text-[11px]">
                              {isOutOfStock ? (
                                <span className="text-red-400 font-semibold">Out of Stock</span>
                              ) : (
                                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                                  <span>In Stock in Coimbatore</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Toggle Button */}
                        <div className="mt-3 pt-3 border-t border-pitstop-800 flex items-center justify-between">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="text-[11px] text-pitstop-400 hover:text-white flex items-center space-x-1"
                          >
                            <span>View specs</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={() => toggleProduct(product.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                              isSelected
                                ? 'bg-racing-orange text-black shadow-md shadow-racing-orange/20'
                                : 'bg-pitstop-800 hover:bg-pitstop-750 text-white border border-pitstop-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Added to Build</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add to Build</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Live Setup Summary & Order */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-5 shadow-2xl">
              
              {/* Build Header */}
              <div className="flex items-center justify-between border-b border-pitstop-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-racing-orange">
                    Step 3: Build Summary
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedBrand} {selectedModel}
                  </h3>
                </div>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={() => setSelectedProductIds([])}
                    className="text-xs text-pitstop-400 hover:text-red-400 flex items-center space-x-1"
                    title="Clear Build"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Selected Items List */}
              <div className="py-3 max-h-72 overflow-y-auto space-y-2.5 divide-y divide-pitstop-800/60 pr-1">
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 text-pitstop-400">
                    <Bike className="w-8 h-8 mx-auto mb-2 text-pitstop-600" />
                    <p className="text-xs font-semibold">Your build is empty.</p>
                    <p className="text-[11px] text-pitstop-500 mt-0.5">
                      Click &quot;+ Add to Build&quot; on compatible accessories on the left.
                    </p>
                  </div>
                ) : (
                  selectedProducts.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="pr-2 min-w-0">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-pitstop-400">
                          {item.subCategory} • <span className="text-racing-orange">{formatPrice(item.price)}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleProduct(item.id)}
                        className="text-pitstop-500 hover:text-red-400 p-1 shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-pitstop-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-pitstop-300">
                  <span>Selected Parts</span>
                  <span className="font-bold text-white">{selectedProducts.length} items</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Build Savings</span>
                    <span className="font-bold">-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-pitstop-800">
                  <span>Total Amount</span>
                  <span className="text-racing-orange text-lg">{formatPrice(totalAmount)}</span>
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
                  <span>Order My Bike Setup on WhatsApp</span>
                </a>

                <button
                  onClick={handleAddAllToCart}
                  disabled={selectedProducts.length === 0}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all border ${
                    selectedProducts.length > 0
                      ? 'bg-pitstop-800 hover:bg-pitstop-750 text-white border-pitstop-700'
                      : 'bg-pitstop-850 text-pitstop-600 border-pitstop-800 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-racing-orange" />
                  <span>Add Entire Setup to Cart</span>
                </button>
              </div>

              {/* Coimbatore Shop Verification Note */}
              <div className="mt-4 pt-3 border-t border-pitstop-800 text-[11px] text-pitstop-400 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Bikerz Pitstop will verify your bike model and bolt compatibility over WhatsApp before dispatch or shop installation.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
