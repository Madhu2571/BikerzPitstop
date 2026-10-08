'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  ArrowLeft, 
  AlertCircle, 
  Bike, 
  Tag, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Product, ProductCategory, ProductSubCategory } from '@/types';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS, HELMET_TYPES } from '@/data/products';
import { ALL_BIKE_MODELS } from '@/data/bikes';
import { formatPrice } from '@/lib/whatsapp';

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [brand, setBrand] = useState(initialData?.brand || 'Axor');
  const [customBrand, setCustomBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>(initialData?.category || 'Helmets');
  const [subCategory, setSubCategory] = useState<string>(initialData?.subCategory || 'Full Face');
  const [description, setDescription] = useState(initialData?.description || '');

  // Pricing & Offers
  const [mrp, setMrp] = useState<number>(initialData?.mrp || 4999);
  const [price, setPrice] = useState<number>(initialData?.price || 4499);
  const [onOffer, setOnOffer] = useState<boolean>(initialData?.onOffer || false);
  const [offerPrice, setOfferPrice] = useState<number>(initialData?.offerPrice || initialData?.price || 3999);

  // Stock & Status
  const [stockQuantity, setStockQuantity] = useState<number>(
    initialData?.stockQuantity !== undefined 
      ? initialData.stockQuantity 
      : (initialData?.availability === 'out_of_stock' ? 0 : 10)
  );
  const [published, setPublished] = useState<boolean>(initialData?.published !== false);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [badge, setBadge] = useState<string>(initialData?.badge || '');

  // Images
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0 
      ? initialData.images 
      : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Variants (Sizes & Colours)
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ['M', 'L', 'XL']);
  const [newSize, setNewSize] = useState('');
  const [colours, setColours] = useState<string[]>(initialData?.colours || ['Matte Black']);
  const [newColour, setNewColour] = useState('');

  // Bike Compatibility
  const [compatibleBikes, setCompatibleBikes] = useState<string[]>(
    initialData?.compatibleBikes || ['Universal']
  );
  const [bikeInput, setBikeInput] = useState('');

  // Specifications Key-Value
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    initialData?.specifications 
      ? Object.entries(initialData.specifications).map(([k, v]) => ({ key: k, value: v }))
      : [
          { key: 'Certification', value: 'ECE 22.06 & DOT Certified' },
          { key: 'Material', value: 'High Grade ABS' },
        ]
  );

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug from name if empty or creating new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setImages((prev) => [...prev, data.url]);
      } else {
        setErrorMessage(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Specifications handler
  const addSpecRow = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', text: string) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[index][field] = text;
      return copy;
    });
  };

  const removeSpecRow = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('Please add at least one product image.');
      return;
    }

    // Convert specs array back to Record<string, string>
    const specsRecord: Record<string, string> = {};
    specifications.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const finalBrand = brand === 'Other' && customBrand.trim() ? customBrand.trim() : brand;
    const finalStock = Number(stockQuantity);
    const finalPrice = Number(price);
    const finalMrp = Number(mrp);
    const finalOfferPrice = Number(offerPrice);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: finalBrand,
      category,
      subCategory,
      mrp: finalMrp,
      price: onOffer ? finalOfferPrice : finalPrice,
      onOffer,
      offerPrice: finalOfferPrice,
      stockQuantity: finalStock,
      availability: finalStock > 0 ? 'in_stock' : 'out_of_stock',
      published,
      featured,
      badge: badge.trim() || undefined,
      images,
      description: description.trim(),
      specifications: specsRecord,
      compatibleBikes: compatibleBikes.length > 0 ? compatibleBikes : ['Universal'],
      sizes,
      colours,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/admin/products/${initialData?.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to save product');
        setIsSubmitting(false);
        return;
      }

      // Success: redirect back to admin products list
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving.');
      setIsSubmitting(false);
    }
  };

  const calculatedDiscount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Bar with Back and Save */}
      <div className="flex items-center justify-between border-b border-pitstop-800 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs font-bold text-pitstop-400 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-racing-orange hover:bg-racing-amber disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-racing-orange/20 transition-all flex items-center space-x-2"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? 'Save Changes' : 'Create Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center space-x-2 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
          <Tag className="w-4 h-4 text-racing-orange mr-2" />
          Basic Product Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-racing-orange">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Axor Apex Venomous Full Face Helmet"
              value={name}
              onChange={handleNameChange}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              URL Slug <span className="text-racing-orange">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="axor-apex-venomous-helmet"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Brand
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-racing-orange font-bold"
            >
              {PRODUCT_BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
              <option value="Other">Other (Custom Brand)</option>
            </select>
            {brand === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom brand name..."
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-2 w-full bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as ProductCategory;
                  setCategory(newCat);
                  setSubCategory(newCat === 'Helmets' ? 'Full Face' : newCat === 'Lighting' ? 'Auxiliary Lights' : 'Crash Guards');
                }}
                className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-racing-orange font-bold"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Sub-Category
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Full Face, Crash Guards"
                className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-racing-orange"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
            Product Description
          </label>
          <textarea
            rows={3}
            placeholder="Detailed features, materials, ventilation, fitment guidance..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl p-3 text-xs text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
          />
        </div>
      </div>

      {/* Section 2: Pricing, MRP, Discounts & Offers */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
          <Tag className="w-4 h-4 text-emerald-400 mr-2" />
          Pricing, MRP &amp; Offer Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Original MRP (₹)
            </label>
            <input
              type="number"
              min={0}
              required
              value={mrp}
              onChange={(e) => setMrp(Number(e.target.value))}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Regular Selling Price (₹)
            </label>
            <input
              type="number"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Enable Special Offer?
            </label>
            <button
              type="button"
              onClick={() => setOnOffer(!onOffer)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center space-x-2 ${
                onOffer 
                  ? 'bg-racing-orange text-black font-black' 
                  : 'bg-pitstop-850 text-zinc-400 border border-pitstop-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{onOffer ? 'Offer Active' : 'No Offer'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Offer / Sale Price (₹)
            </label>
            <input
              type="number"
              min={0}
              disabled={!onOffer}
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full bg-pitstop-850 border border-pitstop-700 disabled:opacity-30 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-racing-orange focus:outline-none focus:border-racing-orange"
            />
          </div>
        </div>

        {/* Calculated Discount Preview */}
        <div className="p-3 bg-pitstop-950 border border-pitstop-800 rounded-xl text-xs flex items-center justify-between text-pitstop-400">
          <span>
            Effective Customer Price: <strong className="text-white font-mono">{formatPrice(onOffer ? offerPrice : price)}</strong>
          </span>
          {mrp > (onOffer ? offerPrice : price) && (
            <span className="text-emerald-400 font-bold">
              Discount: {Math.round(((mrp - (onOffer ? offerPrice : price)) / mrp) * 100)}% OFF (Saves {formatPrice(mrp - (onOffer ? offerPrice : price))})
            </span>
          )}
        </div>
      </div>

      {/* Section 3: Stock Quantity & Store Visibility */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
          <Layers className="w-4 h-4 text-amber-400 mr-2" />
          Stock Inventory &amp; Visibility Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Exact Stock Quantity <span className="text-racing-orange">*</span>
            </label>
            <input
              type="number"
              min={0}
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-racing-orange"
            />
            <span className="text-[10px] text-pitstop-400 block mt-1">
              {stockQuantity === 0 ? '⚠️ Will show "Out of Stock"' : '✓ Will show "In Stock"'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Badge Tag (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bestseller, ECE 22.06"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Store Visibility
            </label>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                published 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600' 
                  : 'bg-pitstop-850 text-zinc-400 border border-pitstop-700'
              }`}
            >
              {published ? '✓ Published (Visible)' : 'Hidden / Draft'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Homepage Featured
            </label>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                featured 
                  ? 'bg-amber-950/80 text-racing-yellow border border-amber-600 font-bold' 
                  : 'bg-pitstop-850 text-zinc-400 border border-pitstop-700'
              }`}
            >
              {featured ? '★ Featured on Home' : 'Normal Item'}
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Product Images with Preview & Upload */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
          <ImageIcon className="w-4 h-4 text-racing-orange mr-2" />
          Product Images (Multiple Supported)
        </h3>

        {/* Upload Button & External URL input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* File Upload */}
          <div className="bg-pitstop-850 border border-dashed border-pitstop-700 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <Upload className="w-6 h-6 text-pitstop-400 mb-2" />
            <span className="text-xs font-bold text-white block">
              {isUploading ? 'Uploading file...' : 'Upload Image from Computer'}
            </span>
            <span className="text-[10px] text-pitstop-400 mb-3">PNG, JPG, WEBP up to 5MB</span>
            <label className="px-3.5 py-1.5 bg-pitstop-800 hover:bg-pitstop-700 border border-pitstop-600 rounded-lg text-xs font-bold cursor-pointer text-zinc-200">
              Browse File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* External URL add */}
          <div className="bg-pitstop-850 border border-pitstop-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-1">Add Image by Web URL</span>
              <span className="text-[10px] text-pitstop-400 block mb-2">Unsplash, CDN or hosted image link</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full bg-pitstop-900 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-3 py-1.5 px-3 bg-pitstop-800 hover:bg-pitstop-700 border border-pitstop-600 rounded-lg text-xs font-bold text-white"
            >
              + Add Image URL
            </button>
          </div>
        </div>

        {/* Live Image Previews Gallery */}
        <div>
          <span className="text-xs font-bold text-pitstop-400 uppercase tracking-wider block mb-2">
            Image Gallery ({images.length} images)
          </span>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 bg-pitstop-950 rounded-xl overflow-hidden border border-pitstop-700 group"
              >
                <Image
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/80 text-racing-orange text-[9px] font-black rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Technical Specifications Key-Value Editor */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
            <HelpCircle className="w-4 h-4 text-racing-orange mr-2" />
            Specifications &amp; Features
          </h3>
          <button
            type="button"
            onClick={addSpecRow}
            className="text-xs text-racing-orange hover:underline font-bold"
          >
            + Add Spec Row
          </button>
        </div>

        <div className="space-y-2">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Spec Key (e.g. Weight, Visor, Material)"
                value={spec.key}
                onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                className="w-1/3 bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. 1500g ± 50g, Anti-scratch Polycarbonate)"
                value={spec.value}
                onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                className="flex-1 bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => removeSpecRow(idx)}
                className="p-2 text-pitstop-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Bike Compatibility & Variants */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
          <Bike className="w-4 h-4 text-racing-orange mr-2" />
          Bike Compatibility, Sizes &amp; Colours
        </h3>

        {/* Bike Compatibility */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
            Compatible Bikes (Select or Type)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {compatibleBikes.map((b) => (
              <span
                key={b}
                className="inline-flex items-center text-xs bg-pitstop-850 text-racing-amber border border-pitstop-700 px-2.5 py-1 rounded-lg"
              >
                {b}
                <button
                  type="button"
                  onClick={() => setCompatibleBikes((prev) => prev.filter((item) => item !== b))}
                  className="ml-1.5 hover:text-red-400"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type bike model (e.g. Himalayan 450, Duke 390, Universal) and press Enter"
              value={bikeInput}
              onChange={(e) => setBikeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (bikeInput.trim() && !compatibleBikes.includes(bikeInput.trim())) {
                    setCompatibleBikes([...compatibleBikes, bikeInput.trim()]);
                    setBikeInput('');
                  }
                }
              }}
              className="flex-1 bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (bikeInput.trim() && !compatibleBikes.includes(bikeInput.trim())) {
                  setCompatibleBikes([...compatibleBikes, bikeInput.trim()]);
                  setBikeInput('');
                }
              }}
              className="px-3 py-2 bg-pitstop-800 hover:bg-pitstop-700 text-xs font-bold rounded-lg text-white"
            >
              Add Bike
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-pitstop-800">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center text-xs bg-pitstop-850 text-white border border-pitstop-700 px-2.5 py-1 rounded-lg"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSizes((prev) => prev.filter((item) => item !== s))}
                    className="ml-1.5 hover:text-red-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add size (e.g. S, M, L, XL)..."
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSize.trim() && !sizes.includes(newSize.trim())) {
                    setSizes([...sizes, newSize.trim()]);
                    setNewSize('');
                  }
                }}
                className="px-3 py-2 bg-pitstop-800 text-xs font-bold rounded-lg text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Colours */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Available Colours / Finishes
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {colours.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center text-xs bg-pitstop-850 text-white border border-pitstop-700 px-2.5 py-1 rounded-lg"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => setColours((prev) => prev.filter((item) => item !== c))}
                    className="ml-1.5 hover:text-red-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add colour (e.g. Matte Black, Gloss White)..."
                value={newColour}
                onChange={(e) => setNewColour(e.target.value)}
                className="flex-1 bg-pitstop-850 border border-pitstop-700 rounded-lg p-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newColour.trim() && !colours.includes(newColour.trim())) {
                    setColours([...colours, newColour.trim()]);
                    setNewColour('');
                  }
                }}
                className="px-3 py-2 bg-pitstop-800 text-xs font-bold rounded-lg text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Action Button */}
      <div className="pt-4 flex items-center justify-end space-x-4 border-t border-pitstop-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-xs font-bold text-pitstop-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-racing-orange hover:bg-racing-amber disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-racing-orange/20 transition-all flex items-center space-x-2"
        >
          {isSubmitting ? (
            <span>Saving Product...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Update Product' : 'Publish Product to Store'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
