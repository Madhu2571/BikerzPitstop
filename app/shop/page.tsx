'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Filter, 
  X, 
  RotateCcw, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Bike,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_BRANDS, HELMET_TYPES, HELMET_SIZES, COMMON_COLOURS } from '@/data/products';
import { POPULAR_BIKE_BRANDS, ALL_BIKE_MODELS } from '@/data/bikes';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductRequestModal from '@/components/ProductRequestModal';
import { formatPrice } from '@/lib/whatsapp';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query parameter initial values
  const initialCategory = searchParams.get('category') || '';
  const initialSubCategory = searchParams.get('subCategory') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialBike = searchParams.get('bike') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedBike, setSelectedBike] = useState<string>(initialBike);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>(initialSort);

  // Mobile Filter Drawer toggle
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category') || '');
    if (searchParams.get('subCategory')) setSelectedSubCategory(searchParams.get('subCategory') || '');
    if (searchParams.get('brand')) setSelectedBrand(searchParams.get('brand') || '');
    if (searchParams.get('bike')) setSelectedBike(searchParams.get('bike') || '');
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search') || '');
    if (searchParams.get('sort')) setSortOption(searchParams.get('sort') || 'featured');
  }, [searchParams]);

  // Genuine Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // SubCategory / Helmet type filter
      if (selectedSubCategory && product.subCategory !== selectedSubCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Bike compatibility filter
      if (selectedBike) {
        const isCompatible = product.compatibleBikes.some((b) => 
          b.toLowerCase() === 'universal' || b.toLowerCase().includes(selectedBike.toLowerCase())
        );
        if (!isCompatible) return false;
      }

      // Availability filter
      if (selectedAvailability === 'in_stock' && product.availability !== 'in_stock') {
        return false;
      }
      if (selectedAvailability === 'out_of_stock' && product.availability !== 'out_of_stock') {
        return false;
      }

      // Size filter (applicable primarily to helmets/covers)
      if (selectedSize) {
        const hasSize = product.sizes?.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()));
        if (!hasSize) return false;
      }

      // Colour filter
      if (selectedColour) {
        const hasColour = product.colours?.some((c) => c.toLowerCase().includes(selectedColour.toLowerCase()));
        if (!hasColour) return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Search filter (Name, Brand, Category, Compatible Bike)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSubCategory = product.subCategory.toLowerCase().includes(query);
        const matchesBike = product.compatibleBikes.some((b) => b.toLowerCase().includes(query));

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSubCategory && !matchesBike) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      if (sortOption === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      // default: 'featured'
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedBike,
    selectedAvailability,
    selectedSize,
    selectedColour,
    maxPrice,
    searchQuery,
    sortOption,
  ]);

  // Active filter count
  const activeFiltersCount = [
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedBike,
    selectedAvailability !== 'all',
    selectedSize,
    selectedColour,
    maxPrice < 12000,
    searchQuery,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedBrand('');
    setSelectedBike('');
    setSelectedAvailability('all');
    setSelectedSize('');
    setSelectedColour('');
    setMaxPrice(12000);
    setSearchQuery('');
    setSortOption('featured');
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header breadcrumb & title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Product Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-pitstop-400 mt-1">
          Explore genuine motorcycle accessories, riding helmets, and crash protection available at Bikerz Pitstop Coimbatore.
        </p>
      </div>

      {/* Top Search & Sorting Bar */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-3.5 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, brand, category, or bike model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-pitstop-850 border border-pitstop-700/80 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
          />
          <Search className="w-4 h-4 text-pitstop-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-pitstop-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Sort & Mobile Filter Button */}
        <div className="flex items-center space-x-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="md:hidden flex items-center space-x-2 px-3.5 py-2 bg-pitstop-850 border border-pitstop-700 rounded-lg text-xs font-bold text-white"
          >
            <Filter className="w-3.5 h-3.5 text-racing-orange" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-racing-orange text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
            <span className="hidden sm:inline text-pitstop-400">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-racing-orange font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block col-span-1 space-y-6">
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-5 sticky top-28 space-y-5">
            <div className="flex items-center justify-between border-b border-pitstop-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center">
                <Filter className="w-3.5 h-3.5 text-racing-orange mr-1.5" />
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-racing-orange hover:underline font-bold flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory(''); // Reset subcategory when category changes
                }}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-racing-orange"
              >
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category / Helmet Type Filter */}
            {selectedCategory === 'Helmets' ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Helmet Type
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-racing-orange"
                >
                  <option value="">All Helmet Types</option>
                  {HELMET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            ) : selectedCategory === 'Motorcycle Accessories' ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Accessory Type
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-racing-orange"
                >
                  <option value="">All Accessories</option>
                  <option value="Crash Guards">Crash Guards</option>
                  <option value="Hand Guards">Hand Guards</option>
                  <option value="Mirrors">Mirrors</option>
                  <option value="Levers">Levers</option>
                  <option value="Bar Ends">Bar Ends</option>
                  <option value="Footrests">Footrests</option>
                  <option value="Mobile Holders">Mobile Holders</option>
                  <option value="USB Chargers">USB Chargers</option>
                  <option value="Bike Covers">Bike Covers</option>
                  <option value="Radiator Guards">Radiator Guards</option>
                </select>
              </div>
            ) : null}

            {/* Brand Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-racing-orange"
              >
                <option value="">All Brands</option>
                {PRODUCT_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Bike Compatibility Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                Compatible Bike
              </label>
              <select
                value={selectedBike}
                onChange={(e) => setSelectedBike(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-racing-orange"
              >
                <option value="">All Bikes / Universal</option>
                {POPULAR_BIKE_BRANDS.map((b) => (
                  <optgroup key={b.brand} label={b.brand}>
                    {b.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                Availability
              </label>
              <div className="space-y-1.5 text-xs text-zinc-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'all'}
                    onChange={() => setSelectedAvailability('all')}
                    className="accent-racing-orange"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'in_stock'}
                    onChange={() => setSelectedAvailability('in_stock')}
                    className="accent-racing-orange"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'out_of_stock'}
                    onChange={() => setSelectedAvailability('out_of_stock')}
                    className="accent-racing-orange"
                  />
                  <span>Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Size Filter (Helmets) */}
            {selectedCategory === 'Helmets' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Helmet Size
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`py-1 text-xs rounded border transition-colors ${
                        selectedSize === size
                          ? 'bg-racing-orange text-black font-bold border-racing-orange'
                          : 'bg-pitstop-850 text-zinc-300 border-pitstop-700 hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                <span>Max Price</span>
                <span className="text-racing-orange font-mono">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={12000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-racing-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-pitstop-500 mt-1">
                <span>₹1,000</span>
                <span>₹12,000</span>
              </div>
            </div>

            {/* Request Product Prompt */}
            <div className="pt-2 border-t border-pitstop-800">
              <button
                type="button"
                onClick={() => setRequestModalOpen(true)}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-pitstop-850 hover:bg-pitstop-800 text-racing-orange font-bold text-xs rounded-lg border border-pitstop-700 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Request Custom Part</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Listing Grid */}
        <div className="col-span-1 md:col-span-3">
          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-pitstop-400 font-bold uppercase tracking-wider">
                Filters:
              </span>
              {selectedCategory && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-zinc-200 border border-pitstop-700 px-2.5 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubCategory && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-zinc-200 border border-pitstop-700 px-2.5 py-1 rounded-full">
                  {selectedSubCategory}
                  <button onClick={() => setSelectedSubCategory('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-zinc-200 border border-pitstop-700 px-2.5 py-1 rounded-full">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBike && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-racing-amber border border-pitstop-700 px-2.5 py-1 rounded-full">
                  Bike: {selectedBike}
                  <button onClick={() => setSelectedBike('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-zinc-200 border border-pitstop-700 px-2.5 py-1 rounded-full">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center text-xs bg-pitstop-850 text-zinc-200 border border-pitstop-700 px-2.5 py-1 rounded-full">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-racing-orange">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-racing-orange hover:underline font-bold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-pitstop-400 mb-4">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> products
            </span>
          </div>

          {/* Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-pitstop-800 rounded-full flex items-center justify-center mx-auto text-racing-orange">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                No Matching Products Found
              </h3>
              <p className="text-xs text-pitstop-400 max-w-md mx-auto">
                We couldn&apos;t find any items matching your current filters or search query. Try adjusting your filters or send us a quick product request on WhatsApp!
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-pitstop-800 hover:bg-pitstop-700 text-white text-xs font-bold uppercase rounded-lg border border-pitstop-700 transition-colors"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="px-4 py-2 bg-racing-orange hover:bg-racing-amber text-black text-xs font-black uppercase rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Request This Product</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in">
          <div className="w-full max-w-xs bg-pitstop-900 h-full overflow-y-auto p-6 flex flex-col justify-between border-l border-pitstop-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-pitstop-800 pb-4">
                <span className="text-sm font-black uppercase tracking-wider text-white flex items-center">
                  <Filter className="w-4 h-4 text-racing-orange mr-2" />
                  Filter Products
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-pitstop-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory('');
                  }}
                  className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2.5"
                >
                  <option value="">All Categories</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Brand */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2.5"
                >
                  <option value="">All Brands</option>
                  {PRODUCT_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Bike */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Bike Compatibility
                </label>
                <select
                  value={selectedBike}
                  onChange={(e) => setSelectedBike(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 text-xs text-white rounded-lg p-2.5"
                >
                  <option value="">All Bikes / Universal</option>
                  {POPULAR_BIKE_BRANDS.map((b) => (
                    <optgroup key={b.brand} label={b.brand}>
                      {b.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Mobile Availability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pitstop-400 mb-2">
                  Availability
                </label>
                <div className="space-y-2 text-xs text-zinc-300">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="m_avail"
                      checked={selectedAvailability === 'all'}
                      onChange={() => setSelectedAvailability('all')}
                      className="accent-racing-orange"
                    />
                    <span>All Products</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="m_avail"
                      checked={selectedAvailability === 'in_stock'}
                      onChange={() => setSelectedAvailability('in_stock')}
                      className="accent-racing-orange"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Mobile Max Price */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase text-pitstop-400 mb-2">
                  <span>Max Price</span>
                  <span className="text-racing-orange font-mono">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={12000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-racing-orange"
                />
              </div>
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="pt-6 border-t border-pitstop-800 space-y-2">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-3 bg-racing-orange hover:bg-racing-amber text-black font-black text-xs uppercase tracking-wider rounded-lg text-center"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setFilterDrawerOpen(false);
                }}
                className="w-full py-2.5 bg-pitstop-850 text-zinc-400 text-xs font-bold uppercase rounded-lg"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Request Modal */}
      <ProductRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        initialBikeModel={selectedBike}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-pitstop-400">
        Loading catalogue...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
