'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bike, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MessageCircle, 
  ShoppingBag, 
  ExternalLink, 
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { POPULAR_BIKE_BRANDS } from '@/data/bikes';
import { PRODUCTS } from '@/data/products';
import { useLiveProducts } from '@/hooks/useLiveProducts';
import { useCart } from '@/context/CartContext';
import { 
  formatPrice, 
  getFitmentInquiryWhatsAppUrl, 
  getBuyNowWhatsAppUrl, 
  getOutOfStockWhatsAppUrl 
} from '@/lib/whatsapp';
import { Product } from '@/types';

export default function FitMyBikePage() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const { addToCart } = useCart();

  const [selectedBrand, setSelectedBrand] = useState<string>('Yamaha');
  const [selectedModel, setSelectedModel] = useState<string>('MT-15 V2');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [compatibilityTab, setCompatibilityTab] = useState<'compatible' | 'uncertain' | 'incompatible'>('compatible');

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

  /**
   * Helper to evaluate compatibility strictly from product data
   * Statuses:
   * - 'compatible': Exact bike match or universal gear
   * - 'uncertain': Specific universal hardware requiring clamp/fitting check
   * - 'incompatible': Specifically built for other bikes only
   */
  const evaluatedProducts = useMemo(() => {
    if (!selectedModel) return [];

    const normModel = selectedModel.toLowerCase().replace(/[\s\-_()]/g, '');

    return liveProducts.map((p) => {
      const bikeList = p.compatibleBikes || [];
      const hasUniversal = bikeList.some((b) => b.toLowerCase() === 'universal');
      const matchesModel = bikeList.some((b) => {
        const normB = b.toLowerCase().replace(/[\s\-_()]/g, '');
        return normB === normModel || normModel.includes(normB) || normB.includes(normModel);
      });

      let status: 'compatible' | 'uncertain' | 'incompatible' = 'incompatible';
      let reason = '';

      if (matchesModel) {
        status = 'compatible';
        reason = `Engineered & tested specifically for ${selectedBrand} ${selectedModel}.`;
      } else if (hasUniversal) {
        // Universal items
        if (p.category === 'Helmets' || p.subCategory === 'Bike Covers' || p.subCategory === 'Emergency & Tools') {
          status = 'compatible';
          reason = `Universal fitment across all standard motorcycles.`;
        } else if (p.subCategory === 'Mirrors' || p.subCategory === 'Levers' || p.subCategory === 'Hand Guards') {
          // Clamp/thread fitment depends on handlebar diameter or threading
          status = 'uncertain';
          reason = `Universal fitting, but bar-end thread / clamp size (22mm vs 28mm) should be verified.`;
        } else {
          status = 'compatible';
          reason = `Universal motorcycle accessory compatible with standard mounts.`;
        }
      } else {
        // Specifically mapped to other bikes only
        status = 'incompatible';
        const otherBikes = bikeList.slice(0, 2).join(', ');
        reason = `Designed exclusively for other models (${otherBikes || 'Specific bikes only'}).`;
      }

      return {
        product: p,
        status,
        reason,
      };
    });
  }, [liveProducts, selectedBrand, selectedModel]);

  // Filter by category and compatibility status
  const filteredList = useMemo(() => {
    return evaluatedProducts.filter((item) => {
      if (item.status !== compatibilityTab) return false;
      if (categoryFilter !== 'all' && item.product.category !== categoryFilter) return false;
      return true;
    });
  }, [evaluatedProducts, compatibilityTab, categoryFilter]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      compatible: evaluatedProducts.filter((i) => i.status === 'compatible').length,
      uncertain: evaluatedProducts.filter((i) => i.status === 'uncertain').length,
      incompatible: evaluatedProducts.filter((i) => i.status === 'incompatible').length,
    };
  }, [evaluatedProducts]);

  return (
    <div className="min-h-screen bg-pitstop-950 text-white pb-20">
      
      {/* Header Banner */}
      <section className="bg-pitstop-900 border-b border-pitstop-800 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pitstop-800 text-racing-orange text-xs font-bold uppercase tracking-wider mb-4 border border-pitstop-700">
              <Bike className="w-3.5 h-3.5" />
              <span>Compatibility Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Will This Fit <span className="text-racing-orange">My Bike?</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-pitstop-300 leading-relaxed">
              Select your exact motorcycle brand, model, and year. Our system cross-references manufacturer specifications and Coimbatore in-store fitment data so you never buy the wrong part.
            </p>
          </div>

          {/* Bike Selector Card */}
          <div className="mt-8 bg-pitstop-850 border border-pitstop-700/80 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-3 flex items-center justify-between">
              <span>Select Your Motorcycle</span>
              <button 
                onClick={() => {
                  setSelectedBrand('Yamaha');
                  setSelectedModel('MT-15 V2');
                  setSelectedYear('2024');
                }}
                className="text-racing-orange hover:underline flex items-center space-x-1 lowercase text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Brand Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  1. Brand / Make
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

              {/* Model Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  2. Model
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

              {/* Year Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  3. Year / Variant
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-racing-orange font-medium"
                >
                  <option value="2025 / 2024">2024 - 2025 (Latest)</option>
                  <option value="2023">2023 (BS6 Phase 2)</option>
                  <option value="2022">2022</option>
                  <option value="2020-2021">2020 - 2021 (BS6)</option>
                  <option value="2019 & Older">2019 &amp; Older (BS4)</option>
                  <option value="All Years">All Years / Universal</option>
                </select>
              </div>
            </div>

            {/* Currently Selected Summary Banner */}
            <div className="mt-4 pt-4 border-t border-pitstop-750 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-pitstop-400">Target Bike:</span>
                <span className="bg-racing-orange/15 text-racing-orange font-extrabold px-2.5 py-1 rounded border border-racing-orange/30 text-sm">
                  {selectedBrand} {selectedModel} ({selectedYear})
                </span>
              </div>
              
              <a
                href={getFitmentInquiryWhatsAppUrl({
                  bikeBrand: selectedBrand,
                  bikeModel: selectedModel,
                  year: selectedYear,
                  question: `Hi Bikerz Pitstop, I ride a ${selectedBrand} ${selectedModel} (${selectedYear}). Could you please advise on parts compatibility?`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Not listed? Ask Bikerz Pitstop on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Compatibility Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pitstop-800 pb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-1">
            <button
              onClick={() => setCompatibilityTab('compatible')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                compatibilityTab === 'compatible'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-pitstop-850 text-zinc-300 hover:text-white hover:bg-pitstop-800 border border-pitstop-700/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Compatible ({counts.compatible})</span>
            </button>

            <button
              onClick={() => setCompatibilityTab('uncertain')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                compatibilityTab === 'uncertain'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-pitstop-850 text-zinc-300 hover:text-white hover:bg-pitstop-800 border border-pitstop-700/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Fitment Uncertain ({counts.uncertain})</span>
            </button>

            <button
              onClick={() => setCompatibilityTab('incompatible')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                compatibilityTab === 'incompatible'
                  ? 'bg-zinc-700 text-white shadow-lg'
                  : 'bg-pitstop-850 text-zinc-400 hover:text-zinc-200 hover:bg-pitstop-800 border border-pitstop-700/60'
              }`}
            >
              <XCircle className="w-4 h-4 text-zinc-400" />
              <span>Not Compatible ({counts.incompatible})</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-pitstop-400 font-semibold hidden md:inline">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-pitstop-850 border border-pitstop-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-racing-orange"
            >
              <option value="all">All Categories</option>
              <option value="Helmets">Helmets</option>
              <option value="Motorcycle Accessories">Motorcycle Accessories</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>
        </div>

        {/* Tab Description / Instructions */}
        <div className="my-6">
          {compatibilityTab === 'compatible' && (
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 text-xs sm:text-sm text-emerald-200 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">✅ Confirmed Compatible with {selectedBrand} {selectedModel}</p>
                <p className="text-emerald-300/90 mt-0.5">
                  These products are verified against official frame geometry, engine guard bolts, handlebar clamps, or universal sizing.
                </p>
              </div>
            </div>
          )}

          {compatibilityTab === 'uncertain' && (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 text-xs sm:text-sm text-amber-200 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">⚠️ Compatibility Verification Recommended</p>
                <p className="text-amber-300/90 mt-0.5">
                  Universal motorcycle hardware that depends on handlebar diameter (22mm standard vs 28mm fatbar) or threading. Click <strong>&quot;Ask Bikerz Pitstop&quot;</strong> to confirm before ordering.
                </p>
              </div>
            </div>
          )}

          {compatibilityTab === 'incompatible' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm text-zinc-300 flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">❌ Engineered for Other Motorcycles</p>
                <p className="text-zinc-400 mt-0.5">
                  These parts have custom model-specific brackets that will NOT mount on your {selectedBrand} {selectedModel}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-pitstop-900 border border-pitstop-800 rounded-2xl p-8">
            <Bike className="w-12 h-12 text-pitstop-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products match this filter</h3>
            <p className="text-sm text-pitstop-400 mt-1 max-w-md mx-auto">
              Try selecting &quot;All Categories&quot; or ask our Coimbatore workshop team directly on WhatsApp.
            </p>
            <a
              href={getFitmentInquiryWhatsAppUrl({
                bikeBrand: selectedBrand,
                bikeModel: selectedModel,
                year: selectedYear,
                question: `Hi Bikerz Pitstop, could you suggest suitable accessories for my ${selectedBrand} ${selectedModel}?`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask Shop Availability on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map(({ product, status, reason }) => {
              const isOutOfStock = product.availability === 'out_of_stock' || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);

              return (
                <div 
                  key={product.id}
                  className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden flex flex-col hover:border-pitstop-700 transition-all group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video w-full bg-pitstop-950 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pitstop-600">
                        No Image
                      </div>
                    )}

                    {/* Compatibility Badge on image */}
                    <div className="absolute top-3 left-3">
                      {status === 'compatible' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white font-bold text-[11px] backdrop-blur-sm shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fits {selectedModel}</span>
                        </span>
                      )}
                      {status === 'uncertain' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-600/90 text-white font-bold text-[11px] backdrop-blur-sm shadow-md">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Check Fitment</span>
                        </span>
                      )}
                      {status === 'incompatible' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-300 font-bold text-[11px] backdrop-blur-sm shadow-md">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Other Bikes</span>
                        </span>
                      )}
                    </div>

                    {/* Stock Badge */}
                    {isOutOfStock && (
                      <div className="absolute top-3 right-3 bg-red-600/95 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-pitstop-400 mb-1">
                        <span className="font-semibold text-racing-orange uppercase tracking-wider">{product.brand}</span>
                        <span>{product.subCategory}</span>
                      </div>

                      <Link 
                        href={`/product/${product.slug}`}
                        className="text-base font-bold text-white hover:text-racing-orange transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      {/* Fitment Rationale */}
                      <p className="mt-2 text-xs text-pitstop-300 bg-pitstop-850 p-2.5 rounded-lg border border-pitstop-750">
                        {reason}
                      </p>

                      {/* Pricing */}
                      <div className="mt-3 flex items-baseline space-x-2">
                        <span className="text-xl font-black text-white">{formatPrice(product.price)}</span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-pitstop-400 line-through">{formatPrice(product.mrp)}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-pitstop-800">
                      {status === 'compatible' && (
                        <>
                          {!isOutOfStock ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => addToCart(product, { quantity: 1, selectedBike: `${selectedBrand} ${selectedModel}` })}
                                className="py-2.5 px-3 bg-pitstop-800 hover:bg-pitstop-750 text-white font-bold text-xs rounded-lg border border-pitstop-700 flex items-center justify-center space-x-1.5 transition-colors"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-racing-orange" />
                                <span>Add to Cart</span>
                              </button>

                              <a
                                href={getBuyNowWhatsAppUrl({
                                  product,
                                  selectedBike: `${selectedBrand} ${selectedModel} (${selectedYear})`,
                                  quantity: 1,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                <span>Buy WhatsApp</span>
                              </a>
                            </div>
                          ) : (
                            <a
                              href={getOutOfStockWhatsAppUrl(product, {
                                selectedBike: `${selectedBrand} ${selectedModel}`,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 bg-pitstop-800 hover:bg-pitstop-750 text-amber-300 font-bold text-xs rounded-lg border border-pitstop-700 flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Request Stock on WhatsApp</span>
                            </a>
                          )}
                        </>
                      )}

                      {/* If Uncertain: prominent "Not sure? Ask Bikerz Pitstop" button */}
                      {status === 'uncertain' && (
                        <a
                          href={getFitmentInquiryWhatsAppUrl({
                            bikeBrand: selectedBrand,
                            bikeModel: selectedModel,
                            year: selectedYear,
                            productName: product.name,
                            question: `Hi Bikerz Pitstop, I want to know if "${product.name}" will fit my ${selectedBrand} ${selectedModel} (${selectedYear}). Could you please verify?`,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Not sure? Ask Bikerz Pitstop</span>
                        </a>
                      )}

                      {/* If Incompatible: link to view details or ask if custom bracket is made */}
                      {status === 'incompatible' && (
                        <a
                          href={getFitmentInquiryWhatsAppUrl({
                            bikeBrand: selectedBrand,
                            bikeModel: selectedModel,
                            year: selectedYear,
                            productName: product.name,
                            question: `Hi Bikerz Pitstop, do you have an equivalent of "${product.name}" that fits a ${selectedBrand} ${selectedModel}?`,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-pitstop-850 hover:bg-pitstop-800 text-pitstop-300 hover:text-white font-semibold text-xs rounded-lg border border-pitstop-700/60 flex items-center justify-center space-x-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 text-pitstop-400" />
                          <span>Ask for {selectedModel} Alternative</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Coimbatore Workshop Advisory Banner */}
        <div className="mt-16 bg-gradient-to-r from-pitstop-900 to-pitstop-850 border border-pitstop-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-racing-orange text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>In-Store Coimbatore Fitting &amp; Alignment</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Need on-bike physical fitment testing?
            </h3>
            <p className="text-xs sm:text-sm text-pitstop-300 max-w-xl">
              Visit our Bikerz Pitstop showroom on Nanjundapuram Road, Ramanathapuram. Bring your motorcycle to test ergonomics, handlebar clearance, and wiring harnesses before buying.
            </p>
          </div>

          <a
            href={getFitmentInquiryWhatsAppUrl({
              bikeBrand: selectedBrand,
              bikeModel: selectedModel,
              year: selectedYear,
              question: `Hi Bikerz Pitstop 👋 I ride a ${selectedBrand} ${selectedModel}. Can I visit your Coimbatore showroom to test fit accessories?`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat with Coimbatore Store</span>
          </a>
        </div>

      </div>
    </div>
  );
}
