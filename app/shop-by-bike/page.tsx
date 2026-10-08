'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bike, Shield, CheckCircle2, PlusCircle, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { POPULAR_BIKE_BRANDS } from '@/data/bikes';
import ProductCard from '@/components/ProductCard';
import ProductRequestModal from '@/components/ProductRequestModal';
import { useLiveProducts } from '@/hooks/useLiveProducts';

function ShopByBikeContent() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const searchParams = useSearchParams();
  const queryBike = searchParams.get('bike');

  // Find brand for query bike if present
  const initialBrandData = queryBike 
    ? POPULAR_BIKE_BRANDS.find((b) => b.models.includes(queryBike))
    : null;

  const [selectedBrand, setSelectedBrand] = useState<string>(
    initialBrandData ? initialBrandData.brand : 'Royal Enfield'
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    queryBike || 'Himalayan 450'
  );
  const [includeUniversal, setIncludeUniversal] = useState<boolean>(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Update if query param changes
  useEffect(() => {
    if (queryBike) {
      const foundBrand = POPULAR_BIKE_BRANDS.find((b) => b.models.includes(queryBike));
      if (foundBrand) {
        setSelectedBrand(foundBrand.brand);
      }
      setSelectedModel(queryBike);
    }
  }, [queryBike]);

  const currentBrandModels = useMemo(() => {
    return POPULAR_BIKE_BRANDS.find((b) => b.brand === selectedBrand)?.models || [];
  }, [selectedBrand]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    const brandData = POPULAR_BIKE_BRANDS.find((b) => b.brand === brand);
    if (brandData && brandData.models.length > 0) {
      setSelectedModel(brandData.models[0]);
    }
  };

  // Filter products compatible with selected bike
  const compatibleProducts = useMemo(() => {
    return liveProducts.filter((product) => {
      const isDirectMatch = product.compatibleBikes.some((b) => 
        b.toLowerCase() === selectedModel.toLowerCase()
      );
      const isUniversal = product.compatibleBikes.some((b) => 
        b.toLowerCase() === 'universal'
      );

      if (isDirectMatch) return true;
      if (includeUniversal && isUniversal) return true;
      return false;
    });
  }, [selectedModel, includeUniversal]);

  // Separate direct bike-specific custom parts from universal parts
  const directFitCount = PRODUCTS.filter((p) => 
    p.compatibleBikes.some((b) => b.toLowerCase() === selectedModel.toLowerCase())
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Bike Selector Card */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-black text-racing-orange uppercase tracking-widest flex items-center mb-2">
            <Bike className="w-4 h-4 mr-1.5" />
            Fitment Precision Finder
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Shop by Motorcycle Model
          </h1>
          <p className="text-xs sm:text-sm text-pitstop-300 mt-2 leading-relaxed">
            Select your motorcycle manufacturer and exact model. We&apos;ll display every crash guard, slider, mount, auxiliary light, and accessory engineered to fit your machine.
          </p>
        </div>

        {/* Form Selector */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Brand select */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              1. Motorcycle Brand
            </label>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-racing-orange font-bold"
            >
              {POPULAR_BIKE_BRANDS.map((b) => (
                <option key={b.brand} value={b.brand}>
                  {b.brand}
                </option>
              ))}
            </select>
          </div>

          {/* Model select */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              2. Motorcycle Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-racing-orange font-bold text-racing-orange"
            >
              {currentBrandModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Universal toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-2 bg-pitstop-850 border border-pitstop-700/80 rounded-lg px-3.5 py-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUniversal}
                onChange={(e) => setIncludeUniversal(e.target.checked)}
                className="accent-racing-orange w-4 h-4 rounded"
              />
              <span className="text-xs font-semibold text-zinc-200">
                Include Universal Fit Accessories
              </span>
            </label>
          </div>
        </div>

        {/* Quick popular shortcut tags */}
        <div className="mt-6 pt-6 border-t border-pitstop-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-pitstop-400 font-bold uppercase tracking-wider mr-2">
            Quick Select:
          </span>
          {[
            { brand: 'Royal Enfield', model: 'Himalayan 450' },
            { brand: 'Royal Enfield', model: 'Hunter 350' },
            { brand: 'KTM', model: '390 Duke (Gen 3)' },
            { brand: 'Triumph', model: 'Speed 400' },
            { brand: 'Yamaha', model: 'YZF R15 V4' },
            { brand: 'Bajaj', model: 'Dominar 400' },
          ].map((item) => (
            <button
              key={item.model}
              onClick={() => {
                setSelectedBrand(item.brand);
                setSelectedModel(item.model);
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedModel === item.model
                  ? 'bg-racing-orange text-black font-bold border-racing-orange'
                  : 'bg-pitstop-850 text-zinc-300 border-pitstop-700 hover:border-zinc-500'
              }`}
            >
              {item.model}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pitstop-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center">
            <span>Compatible Gear for:</span>
            <span className="text-racing-orange ml-2">{selectedBrand} {selectedModel}</span>
          </h2>
          <p className="text-xs text-pitstop-400 mt-1">
            Found {compatibleProducts.length} compatible items ({directFitCount} engineered model-specific parts).
          </p>
        </div>

        <button
          onClick={() => setRequestModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-pitstop-850 hover:bg-pitstop-800 text-racing-orange font-bold text-xs uppercase rounded-lg border border-pitstop-700 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Need Another Part for {selectedModel}?</span>
        </button>
      </div>

      {/* Compatible Products Grid */}
      {compatibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {compatibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-pitstop-800 rounded-full flex items-center justify-center mx-auto text-racing-orange">
            <Bike className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            No Specific Parts Listed for {selectedModel} Yet
          </h3>
          <p className="text-xs text-pitstop-400 max-w-md mx-auto">
            We regularly stock and source crash guards, bash plates, and luggage racks for this model at our Coimbatore shop. Send us a quick WhatsApp request!
          </p>
          <button
            onClick={() => setRequestModalOpen(true)}
            className="px-5 py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase rounded-lg transition-colors inline-flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request {selectedModel} Parts on WhatsApp</span>
          </button>
        </div>
      )}

      {/* Product Request Modal */}
      <ProductRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        initialBikeModel={`${selectedBrand} ${selectedModel}`}
      />
    </div>
  );
}

export default function ShopByBikePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-pitstop-400">
        Loading bike fitments...
      </div>
    }>
      <ShopByBikeContent />
    </Suspense>
  );
}
