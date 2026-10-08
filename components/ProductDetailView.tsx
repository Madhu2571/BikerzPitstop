'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check 
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice, getBuyNowWhatsAppUrl, getOutOfStockWhatsAppUrl, buildWhatsAppUrl } from '@/lib/whatsapp';
import ProductCard from '@/components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { addToCart } = useCart();

  // State for selections
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [selectedColour, setSelectedColour] = useState<string>(product.colours ? product.colours[0] : '');
  const [selectedBike, setSelectedBike] = useState<string>(
    product.compatibleBikes[0] !== 'Universal' ? product.compatibleBikes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isOutOfStock = product.availability === 'out_of_stock';
  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  // Validate variant selections
  const validateVariants = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size first.');
      return false;
    }
    if (product.colours && product.colours.length > 0 && !selectedColour) {
      setValidationError('Please select a colour first.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!validateVariants()) return;

    addToCart(product, {
      size: selectedSize || undefined,
      colour: selectedColour || undefined,
      selectedBike: selectedBike || undefined,
      quantity,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  // Buy Now on WhatsApp handler
  const handleBuyNow = () => {
    if (!validateVariants()) return;

    const url = getBuyNowWhatsAppUrl({
      product,
      size: selectedSize || undefined,
      colour: selectedColour || undefined,
      selectedBike: selectedBike || undefined,
      quantity,
    });

    window.open(url, '_blank');
  };

  // Ask about this product
  const handleAskAboutProduct = () => {
    const message = `Hi Bikerz Pitstop 👋
I have a question about:
Product: ${product.name}
Brand: ${product.brand}
Link: https://bikerspitstop.com/product/${product.slug}
Could you please share more details?
Thank you.`;
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  // Ask availability when out of stock
  const handleAskAvailability = () => {
    const url = getOutOfStockWhatsAppUrl(product, {
      size: selectedSize || undefined,
      colour: selectedColour || undefined,
      selectedBike: selectedBike || undefined,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-pitstop-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-200 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          {/* Main big image */}
          <div className="relative aspect-square bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center"
            />
            
            {/* Badges on main image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.badge && (
                <span className="bg-racing-orange text-black font-black text-xs uppercase tracking-wider px-3 py-1 rounded shadow-lg">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-pitstop-950/90 text-emerald-400 font-bold text-xs px-2.5 py-1 rounded border border-emerald-500/30">
                  Save {discount}% OFF
                </span>
              )}
            </div>

            {/* In-Stock / Out of Stock pill */}
            <div className="absolute bottom-4 left-4 z-10">
              {isOutOfStock ? (
                <span className="inline-flex items-center text-xs font-bold bg-red-950/95 text-red-300 border border-red-700 px-3 py-1.5 rounded-lg shadow-lg">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-red-400" />
                  OUT OF STOCK
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold bg-emerald-950/95 text-emerald-300 border border-emerald-700 px-3 py-1.5 rounded-lg shadow-lg">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                  GENUINE IN STOCK (COIMBATORE)
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-racing-orange shadow-md shadow-racing-orange/20 scale-105'
                      : 'border-pitstop-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Subcategory */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-racing-orange">
                {product.brand}
              </span>
              <span className="text-xs text-pitstop-400 font-bold uppercase tracking-wider">
                {product.subCategory}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-4 pt-1">
              <span className="text-3xl font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-pitstop-500 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    You Save {formatPrice(product.mrp - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Description snippet */}
            <p className="text-xs sm:text-sm text-pitstop-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Variant Validation Error Notice */}
            {validationError && (
              <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Select Size <span className="text-racing-orange">*</span>
                  </label>
                  <span className="text-[11px] text-pitstop-400">
                    Selected: <strong className="text-white">{selectedSize || 'None'}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setValidationError(null);
                      }}
                      className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'bg-racing-orange text-black border-racing-orange shadow-md'
                          : 'bg-pitstop-900 text-zinc-300 border-pitstop-700 hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colour Selector */}
            {product.colours && product.colours.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Select Colour / Finish <span className="text-racing-orange">*</span>
                  </label>
                  <span className="text-[11px] text-pitstop-400">
                    Selected: <strong className="text-white">{selectedColour || 'None'}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((colour) => (
                    <button
                      key={colour}
                      type="button"
                      onClick={() => {
                        setSelectedColour(colour);
                        setValidationError(null);
                      }}
                      className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedColour === colour
                          ? 'bg-racing-orange text-black border-racing-orange shadow-md'
                          : 'bg-pitstop-900 text-zinc-300 border-pitstop-700 hover:border-zinc-500'
                      }`}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible Bike Selection / Preview */}
            <div className="pt-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Motorcycle Compatibility
              </label>
              {product.compatibleBikes.includes('Universal') ? (
                <div className="p-3 bg-pitstop-900 border border-pitstop-800 rounded-lg text-xs text-zinc-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Universal Fitment — Fits handlebars and chassis mounting points across all bike models.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatibleBikes.map((bike) => (
                      <button
                        key={bike}
                        type="button"
                        onClick={() => setSelectedBike(bike)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                          selectedBike === bike
                            ? 'bg-pitstop-850 text-racing-orange font-bold border-racing-orange'
                            : 'bg-pitstop-900 text-zinc-400 border-pitstop-800 hover:border-zinc-600'
                        }`}
                      >
                        {bike}
                      </button>
                    ))}
                  </div>
                  {selectedBike && (
                    <p className="text-[11px] text-pitstop-400">
                      Fitting for: <strong className="text-white">{selectedBike}</strong> (will be sent in WhatsApp message)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="pt-2 flex items-center space-x-4">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="inline-flex items-center bg-pitstop-900 border border-pitstop-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-zinc-300 hover:text-white disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-zinc-300 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-pitstop-400">
                  Subtotal: <strong className="text-white font-mono">{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-3 pt-4 border-t border-pitstop-800">
            {isOutOfStock ? (
              /* OUT OF STOCK UI */
              <div className="space-y-3">
                <div className="p-3.5 bg-red-950/40 border border-red-800/80 rounded-xl text-center space-y-1">
                  <span className="text-xs font-black uppercase text-red-400 block tracking-wider">
                    Currently Out of Stock
                  </span>
                  <p className="text-[11px] text-pitstop-400">
                    This item is temporarily sold out in our Coimbatore store. Inquire for the next batch arrival date or custom booking.
                  </p>
                </div>

                <button
                  onClick={handleAskAvailability}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>ASK AVAILABILITY ON WHATSAPP</span>
                </button>
              </div>
            ) : (
              /* IN STOCK UI */
              <div className="space-y-2.5">
                {/* 1. BUY NOW ON WHATSAPP */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 bg-racing-orange hover:bg-racing-amber text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-racing-orange/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>BUY NOW ON WHATSAPP</span>
                </button>

                {/* 2. ADD TO CART & 3. ASK ABOUT THIS PRODUCT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-pitstop-700/80 hover:border-zinc-500 transition-all flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-racing-orange" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleAskAboutProduct}
                    className="py-3 px-4 bg-pitstop-900 hover:bg-pitstop-850 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-xl border border-pitstop-800 hover:border-emerald-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>ASK ABOUT THIS PRODUCT</span>
                  </button>
                </div>
              </div>
            )}

            {/* Added Toast Notification */}
            {addedToast && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-600 rounded-lg text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-emerald-400" />
                  Added {quantity}x &ldquo;{product.name}&rdquo; to your shopping cart!
                </span>
                <Link href="/cart" className="text-white underline ml-3 uppercase text-[11px]">
                  View Cart &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications & Technical Details */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center">
          <ShieldCheck className="w-5 h-5 text-racing-orange mr-2" />
          Technical Specifications &amp; Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-pitstop-800 text-xs">
              <span className="text-pitstop-400 font-medium">{key}</span>
              <span className="text-zinc-200 font-bold text-right ml-4">{value}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 text-xs text-pitstop-400 flex items-center space-x-2">
          <span className="text-racing-orange">ℹ️</span>
          <span>
            Need in-person fitment or helmet trials? Our technicians at Bikerz Pitstop Coimbatore provide free installation and visor adjustments on site.
          </span>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-baseline justify-between border-b border-pitstop-800 pb-3">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              More from {product.category}
            </h3>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-racing-orange hover:underline uppercase"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
