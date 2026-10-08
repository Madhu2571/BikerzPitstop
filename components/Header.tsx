'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';
import { useCart } from '@/context/CartContext';
import ProductRequestModal from './ProductRequestModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, isLoaded } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Helmets', href: '/helmets' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'Shop by Bike', href: '/shop-by-bike' },
    { name: 'Help', href: '/help' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-pitstop-950 border-b border-pitstop-800 text-xs text-pitstop-300 py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-zinc-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse"></span>
              Store Open in Ramanathapuram, Coimbatore
            </span>
            <span className="text-pitstop-400">|</span>
            <span className="flex items-center text-pitstop-300">
              <MapPin className="w-3.5 h-3.5 text-racing-orange mr-1" />
              485, Nanjundapuram Rd
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={BUSINESS_CONFIG.phoneLink}
              className="hover:text-white transition-colors flex items-center"
            >
              <Phone className="w-3 h-3 text-racing-orange mr-1" />
              {BUSINESS_CONFIG.phone}
            </a>
            <span className="text-pitstop-400">|</span>
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-racing-orange transition-colors"
            >
              {BUSINESS_CONFIG.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-pitstop-900/95 backdrop-blur-md border-b border-pitstop-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <NextLink href="/" className="flex items-center space-x-2 group">
              <div className="bg-racing-orange text-black font-black text-xl px-2 py-1 rounded tracking-tighter transform -skew-x-6 shadow-lg shadow-racing-orange/20">
                BP
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider uppercase font-sans flex items-center">
                  BIKERZ<span className="text-racing-orange ml-1">PITSTOP</span>
                </span>
                <span className="text-[10px] tracking-widest text-pitstop-400 font-bold uppercase -mt-1 hidden sm:block">
                  Coimbatore • Accessories & Helmets
                </span>
              </div>
            </NextLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-semibold tracking-wide">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md transition-all ${
                      isActive
                        ? 'text-racing-orange bg-pitstop-800/80 font-bold'
                        : 'text-zinc-300 hover:text-white hover:bg-pitstop-800/40'
                    }`}
                  >
                    {link.name}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white border border-pitstop-700/60 transition-colors"
                title="Search products"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Request A Product Modal Trigger */}
              <button
                onClick={() => setRequestModalOpen(true)}
                className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-racing-orange bg-pitstop-850 hover:bg-pitstop-800 border border-pitstop-700/60 rounded-lg transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-racing-orange" />
                <span>Request Part</span>
              </button>

              {/* Cart Button */}
              <NextLink
                href="/cart"
                className="relative p-2 sm:p-2.5 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-white border border-pitstop-700/60 transition-colors group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-200 group-hover:text-racing-orange transition-colors" />
                {isLoaded && totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-racing-orange text-black font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalCount}
                  </span>
                )}
              </NextLink>

              {/* WhatsApp Quick CTA (desktop) */}
              <a
                href={BUSINESS_CONFIG.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white border border-pitstop-700/60 transition-colors"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="bg-pitstop-950 border-t border-b border-pitstop-800 py-3 px-4 transition-all">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search helmets, crash guards, LED lights, bike model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg pl-10 pr-24 py-2.5 text-sm text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
                />
                <Search className="w-4 h-4 text-pitstop-400 absolute left-3 pointer-events-none" />
                <div className="absolute right-2 flex items-center space-x-1">
                  <button
                    type="submit"
                    className="bg-racing-orange hover:bg-racing-amber text-black font-bold px-3 py-1 rounded text-xs transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-pitstop-400 hover:text-white p-1 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-pitstop-950/98 border-b border-pitstop-800 px-4 pt-3 pb-6 space-y-4">
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search accessories & helmets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg pl-9 pr-20 py-2.5 text-sm text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
              />
              <Search className="w-4 h-4 text-pitstop-400 absolute left-3 top-3 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-racing-orange text-black font-bold text-xs px-2.5 py-1.5 rounded"
              >
                Go
              </button>
            </form>

            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-racing-orange text-black font-bold'
                        : 'text-zinc-200 hover:bg-pitstop-850'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </NextLink>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-pitstop-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRequestModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-pitstop-850 text-racing-orange font-bold text-sm rounded-lg border border-pitstop-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Can&apos;t find a product? Request here</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={BUSINESS_CONFIG.phoneLink}
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-pitstop-850 text-white font-semibold text-xs rounded-lg border border-pitstop-700"
                >
                  <Phone className="w-3.5 h-3.5 text-racing-orange" />
                  <span>Call Store</span>
                </a>
                <a
                  href={BUSINESS_CONFIG.whatsappBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Product Request Modal */}
      <ProductRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </>
  );
}
