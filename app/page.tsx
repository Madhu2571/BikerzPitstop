'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Bike, 
  Sparkles, 
  Navigation, 
  Phone, 
  Instagram, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { POPULAR_BIKE_BRANDS } from '@/data/bikes';
import { BUSINESS_CONFIG } from '@/data/business';
import ProductCard from '@/components/ProductCard';
import { useLiveProducts } from '@/hooks/useLiveProducts';

export default function HomePage() {
  const { products: liveProducts } = useLiveProducts(PRODUCTS);
  const [selectedBrand, setSelectedBrand] = useState('Royal Enfield');
  const [selectedModel, setSelectedModel] = useState('Himalayan 450');

  // Products filtered for sections
  const featuredProducts = liveProducts.filter((p) => p.featured).slice(0, 4);
  const newArrivals = liveProducts.filter((p) => p.newArrival).slice(0, 4);
  const popularProducts = liveProducts.filter((p) => p.popular).slice(0, 4);

  // Available models for currently selected brand in Hero Bike Selector
  const currentBrandData = POPULAR_BIKE_BRANDS.find((b) => b.brand === selectedBrand);
  const availableModels = currentBrandData?.models || [];

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    const brandData = POPULAR_BIKE_BRANDS.find((b) => b.brand === brand);
    if (brandData && brandData.models.length > 0) {
      setSelectedModel(brandData.models[0]);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative bg-pitstop-950 border-b border-pitstop-800 pt-12 pb-16 sm:py-24 overflow-hidden">
        {/* Subtle automotive carbon/grid background styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-racing-orange/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Store Location Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pitstop-900 border border-pitstop-700/80 text-xs font-semibold text-zinc-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-racing-orange animate-ping"></span>
              <span className="text-racing-orange font-bold uppercase tracking-wider">Coimbatore Store</span>
              <span className="text-pitstop-500">•</span>
              <span>Ramanathapuram</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
              BIKERZ <span className="text-racing-orange">PITSTOP</span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold text-zinc-200 tracking-wide">
              Motorcycle Accessories &amp; Helmets in Coimbatore
            </p>

            <p className="mt-4 text-sm sm:text-base text-pitstop-300 max-w-2xl leading-relaxed">
              Curated riding gear, heavy-duty crash protection, performance auxiliary lighting, and touring accessories. Direct WhatsApp enquiries, genuine pricing, and in-store Coimbatore fitment.
            </p>

            {/* Hero Buttons: SHOP NOW, SHOP HELMETS, WHATSAPP US */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-racing-orange/20 transition-all flex items-center space-x-2"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/helmets"
                className="px-6 py-3.5 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-sm uppercase tracking-wider rounded-lg border border-pitstop-700 hover:border-zinc-500 transition-all"
              >
                SHOP HELMETS
              </Link>

              <a
                href={BUSINESS_CONFIG.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WHATSAPP US</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="mt-12 pt-8 border-t border-pitstop-850 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-pitstop-300">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-racing-orange shrink-0" />
                <span className="font-semibold text-zinc-200">100% Genuine Gear</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-zinc-200">Instant WhatsApp Checks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bike className="w-4 h-4 text-racing-yellow shrink-0" />
                <span className="font-semibold text-zinc-200">Exact Bike Fitment</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-racing-orange shrink-0" />
                <span className="font-semibold text-zinc-200">Coimbatore Workshop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SHOP BY CATEGORY                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 border-b border-pitstop-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-pitstop-400 mt-1">
              Engineered protection and accessories for everyday commutes and extreme expeditions.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-racing-orange hover:underline uppercase tracking-wider flex items-center"
          >
            <span>All Products</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Helmets */}
          <Link
            href="/helmets"
            className="group relative bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/60 rounded-xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-pitstop-800 rounded-lg text-racing-orange">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold text-pitstop-400 uppercase tracking-widest">
                  ECE 22.06 &amp; DOT
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-racing-orange transition-colors uppercase">
                Helmets
              </h3>
              <p className="text-xs text-pitstop-300 mt-2 leading-relaxed">
                Full Face, Modular, Open Face, Adventure/Off-road lids from Axor, MT, SMK &amp; LS2.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-pitstop-800 flex items-center justify-between text-xs font-bold text-white">
              <span>View Helmets</span>
              <ArrowRight className="w-4 h-4 text-racing-orange group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Motorcycle Accessories */}
          <Link
            href="/accessories"
            className="group relative bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/60 rounded-xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-pitstop-800 rounded-lg text-racing-amber">
                  <Bike className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold text-pitstop-400 uppercase tracking-widest">
                  Crash &amp; Touring
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-racing-orange transition-colors uppercase">
                Motorcycle Accessories
              </h3>
              <p className="text-xs text-pitstop-300 mt-2 leading-relaxed">
                Crash guards, barkbusters, CNC bar-end mirrors, adjustable levers, mobile holders &amp; chargers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-pitstop-800 flex items-center justify-between text-xs font-bold text-white">
              <span>View Accessories</span>
              <ArrowRight className="w-4 h-4 text-racing-orange group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Lighting */}
          <Link
            href="/shop?category=Lighting"
            className="group relative bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/60 rounded-xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-pitstop-800 rounded-lg text-racing-yellow">
                  <Zap className="w-6 h-6" />
                </span>
                <span className="text-xs font-bold text-pitstop-400 uppercase tracking-widest">
                  Highway Night Vision
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-racing-orange transition-colors uppercase">
                Auxiliary Lighting
              </h3>
              <p className="text-xs text-pitstop-300 mt-2 leading-relaxed">
                Maddog auxiliary fog light kits, LED headlight conversions, sequential indicators &amp; relay harnesses.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-pitstop-800 flex items-center justify-between text-xs font-bold text-white">
              <span>View Lighting</span>
              <ArrowRight className="w-4 h-4 text-racing-orange group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SHOP BY BIKE (Interactive Quick Filter)                   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold text-racing-orange uppercase tracking-widest flex items-center mb-2">
              <Bike className="w-4 h-4 mr-1.5" />
              Guaranteed Compatibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Shop by Bike
            </h2>
            <p className="text-xs sm:text-sm text-pitstop-300 mt-2">
              Select your motorcycle brand and model to find crash guards, mounts, luggage racks, and accessories that fit your exact machine.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {/* Step 1: Bike Brand */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                1. Select Brand
              </label>
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-racing-orange font-semibold"
              >
                {POPULAR_BIKE_BRANDS.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Bike Model */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                2. Select Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-racing-orange font-semibold"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Button */}
            <div className="flex items-end">
              <Link
                href={`/shop-by-bike?bike=${encodeURIComponent(selectedModel)}`}
                className="w-full py-3 px-4 bg-racing-orange hover:bg-racing-amber text-black font-black text-xs uppercase tracking-wider rounded-lg text-center shadow-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>SHOW COMPATIBLE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick pills for popular models */}
          <div className="mt-6 pt-6 border-t border-pitstop-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-pitstop-400 font-bold uppercase tracking-wider mr-2">
              Popular Rides:
            </span>
            {['Himalayan 450', '390 Duke (Gen 3)', 'Speed 400', 'Hunter 350', 'YZF R15 V4', 'Dominar 400'].map((bike) => (
              <Link
                key={bike}
                href={`/shop-by-bike?bike=${encodeURIComponent(bike)}`}
                className="px-3 py-1 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-racing-orange rounded-full border border-pitstop-700/60 font-medium transition-colors"
              >
                {bike}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURED PRODUCTS                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 border-b border-pitstop-800 pb-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-racing-orange" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-racing-orange hover:underline uppercase tracking-wider flex items-center"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. NEW ARRIVALS                                              */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 border-b border-pitstop-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-racing-amber" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-bold text-racing-orange hover:underline uppercase tracking-wider flex items-center"
          >
            <span>Explore Latest</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. POPULAR PRODUCTS                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 border-b border-pitstop-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-racing-yellow" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Popular Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-racing-orange hover:underline uppercase tracking-wider flex items-center"
          >
            <span>See Catalogue</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. INSTAGRAM SECTION                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-pink-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Instagram className="w-4 h-4" />
                <span>Follow on Instagram</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {BUSINESS_CONFIG.instagramHandle}
              </h2>
              <p className="text-xs sm:text-sm text-pitstop-400 mt-1">
                Customer bike builds, helmet unboxings, fresh batch arrivals, and weekend ride stories in Coimbatore.
              </p>
            </div>

            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @bikerz_pitstop_coimbatore</span>
            </a>
          </div>

          {/* Grid of visual highlights representing their real Instagram vibe */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Royal Enfield Himalayan 450",
                tag: "#CrashGuardInstalled",
                img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Axor Apex & MT Thunder 4",
                tag: "#ECE2206Lids",
                img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Maddog Fog Lights Setup",
                tag: "#NightRiderCoimbatore",
                img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "KTM Duke 390 Custom Fit",
                tag: "#BikerzPitstopCBE",
                img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
              },
            ].map((post, i) => (
              <a
                key={i}
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-pitstop-950 rounded-lg overflow-hidden border border-pitstop-800"
              >
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] text-pink-400 font-bold uppercase">{post.tag}</span>
                  <span className="text-xs text-white font-bold line-clamp-1">{post.title}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. VISIT STORE (Coimbatore Location)                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-racing-orange uppercase tracking-widest flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-1.5" />
                Physical Store &amp; Fitment Bay
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Visit Bikerz Pitstop Store
              </h2>
              <p className="text-xs sm:text-sm text-pitstop-300 mt-2 leading-relaxed">
                Step in for hands-on helmet sizing, helmet trial, visor changes, and test fitment of crash guards and handlebar accessories.
              </p>

              <div className="mt-6 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start space-x-3 text-zinc-200">
                  <MapPin className="w-4 h-4 text-racing-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Address:</span>
                    <span>{BUSINESS_CONFIG.address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-zinc-200">
                  <Clock className="w-4 h-4 text-racing-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Store Timings:</span>
                    <span>Monday - Saturday: {BUSINESS_CONFIG.hours.weekdays}</span>
                    <span className="block text-pitstop-400">Sunday: {BUSINESS_CONFIG.hours.sunday}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-zinc-200">
                  <Phone className="w-4 h-4 text-racing-orange shrink-0" />
                  <div>
                    <span className="font-bold text-white mr-2">Phone:</span>
                    <a href={BUSINESS_CONFIG.phoneLink} className="text-racing-orange hover:underline font-bold">
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* GET DIRECTIONS clean button */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href={BUSINESS_CONFIG.phoneLink}
                className="px-6 py-3 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-pitstop-700 transition-all flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-racing-orange" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          {/* Interactive visual location card */}
          <div className="bg-pitstop-950 p-6 sm:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-pitstop-800">
            <div className="border border-pitstop-800 rounded-xl p-6 bg-pitstop-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-racing-orange uppercase tracking-wider">
                  Ramanathapuram Hub
                </span>
                <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded">
                  Active Store
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Bikerz Pitstop Coimbatore
              </h4>
              <p className="text-xs text-pitstop-400">
                Located conveniently on Nanjundapuram Road near Keelakarai &amp; Ramanathapuram signal. Plenty of parking space for motorcycles outside the store.
              </p>
              <div className="pt-2">
                <a
                  href={BUSINESS_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-pitstop-800 hover:bg-pitstop-700 text-white text-xs font-bold uppercase rounded border border-pitstop-700 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-racing-orange" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CONTACT / WHATSAPP CTA                                    */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pitstop-900 via-pitstop-850 to-pitstop-900 border border-racing-orange/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 bg-racing-orange/10 border border-racing-orange/30 text-racing-orange text-xs font-bold uppercase tracking-wider rounded-full">
              Direct Rider Support
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Order or Enquire via WhatsApp
            </h2>
            <p className="text-xs sm:text-sm text-pitstop-300">
              Found something you love? Have doubts about sizing or bike mounting? We confirm stock and dispatch details directly on WhatsApp in minutes.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={BUSINESS_CONFIG.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp: {BUSINESS_CONFIG.phone}</span>
              </a>
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-pitstop-800 hover:bg-pitstop-700 text-white font-bold text-sm uppercase tracking-wider rounded-lg border border-pitstop-700 transition-all"
              >
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
