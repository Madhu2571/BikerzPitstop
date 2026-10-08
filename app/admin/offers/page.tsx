'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Tag, 
  Search, 
  Sparkles, 
  Save, 
  Check, 
  Percent, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminOffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'offers' | 'regular'>('all');

  // Local editing states
  const [editingRows, setEditingRows] = useState<Record<string, {
    price: number;
    mrp: number;
    onOffer: boolean;
    offerPrice: number;
  }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          const initialMap: typeof editingRows = {};
          data.products.forEach((p: Product) => {
            initialMap[p.id] = {
              price: p.price,
              mrp: p.mrp || p.price,
              onOffer: !!p.onOffer,
              offerPrice: p.offerPrice || p.price,
            };
          });
          setEditingRows(initialMap);
        }
      }
    } catch (err) {
      console.error('Failed to load pricing data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (productId: string, field: 'price' | 'mrp' | 'onOffer' | 'offerPrice', value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSaveRow = async (product: Product) => {
    const row = editingRows[product.id];
    if (!row) return;

    setSavingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: row.price,
          mrp: row.mrp,
          onOffer: row.onOffer,
          offerPrice: row.offerPrice,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
        setSavedFeedback(`Pricing updated for "${product.name}"`);
        setTimeout(() => setSavedFeedback(null), 3000);
      } else {
        alert(data.error || 'Failed to update pricing');
      }
    } catch (err) {
      alert('Error saving pricing');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }

      const row = editingRows[p.id];
      if (filterMode === 'offers' && !row?.onOffer) return false;
      if (filterMode === 'regular' && row?.onOffer) return false;

      return true;
    });
  }, [products, searchQuery, filterMode, editingRows]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Pricing &amp; Special Offers Control
        </h1>
        <p className="text-xs text-pitstop-400 mt-1">
          Configure original MRPs, regular selling prices, and active festival/promotional offer discounts. Changes sync immediately to the customer storefront.
        </p>
      </div>

      {/* Success Banner */}
      {savedFeedback && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by name or brand to adjust prices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-pitstop-850 border border-pitstop-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
          />
          <Search className="w-4 h-4 text-pitstop-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              filterMode === 'all'
                ? 'bg-racing-orange text-black'
                : 'bg-pitstop-850 text-zinc-300 hover:text-white'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('offers')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              filterMode === 'offers'
                ? 'bg-racing-orange text-black'
                : 'bg-pitstop-850 text-racing-orange hover:text-white'
            }`}
          >
            Active Offers
          </button>
          <button
            onClick={() => setFilterMode('regular')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              filterMode === 'regular'
                ? 'bg-racing-orange text-black'
                : 'bg-pitstop-850 text-zinc-400 hover:text-white'
            }`}
          >
            Regular Pricing
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pitstop-950 text-pitstop-400 font-bold uppercase tracking-wider border-b border-pitstop-800 text-[10px]">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-4 py-3">Original MRP (₹)</th>
                <th className="px-4 py-3">Standard Price (₹)</th>
                <th className="px-4 py-3 text-center">Offer Status</th>
                <th className="px-4 py-3">Offer Price (₹)</th>
                <th className="px-4 py-3 text-center">Customer Sees</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitstop-800/60 text-zinc-300">
              {filteredProducts.map((p) => {
                const row = editingRows[p.id] || {
                  price: p.price,
                  mrp: p.mrp || p.price,
                  onOffer: !!p.onOffer,
                  offerPrice: p.offerPrice || p.price,
                };
                const effectivePrice = row.onOffer ? row.offerPrice : row.price;
                const discount = row.mrp > effectivePrice ? Math.round(((row.mrp - effectivePrice) / row.mrp) * 100) : 0;
                const isSaving = savingId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-pitstop-850/50 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 bg-pitstop-950 rounded-lg overflow-hidden shrink-0 border border-pitstop-800">
                          <Image
                            src={p.images[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-racing-orange uppercase font-semibold">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Original MRP */}
                    <td className="px-4 py-3.5">
                      <input
                        type="number"
                        min={0}
                        value={row.mrp}
                        onChange={(e) => handleFieldChange(p.id, 'mrp', Number(e.target.value))}
                        className="w-24 bg-pitstop-850 border border-pitstop-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-pitstop-400 focus:outline-none focus:border-racing-orange"
                      />
                    </td>

                    {/* Regular Price */}
                    <td className="px-4 py-3.5">
                      <input
                        type="number"
                        min={0}
                        value={row.price}
                        onChange={(e) => handleFieldChange(p.id, 'price', Number(e.target.value))}
                        className="w-24 bg-pitstop-850 border border-pitstop-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-racing-orange"
                      />
                    </td>

                    {/* Offer Toggle */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleFieldChange(p.id, 'onOffer', !row.onOffer)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          row.onOffer
                            ? 'bg-racing-orange text-black shadow-md'
                            : 'bg-pitstop-850 text-zinc-500 border border-pitstop-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{row.onOffer ? 'ON OFFER' : 'STANDARD'}</span>
                      </button>
                    </td>

                    {/* Offer Price */}
                    <td className="px-4 py-3.5">
                      <input
                        type="number"
                        min={0}
                        disabled={!row.onOffer}
                        value={row.offerPrice}
                        onChange={(e) => handleFieldChange(p.id, 'offerPrice', Number(e.target.value))}
                        className="w-24 bg-pitstop-850 border border-pitstop-700 disabled:opacity-30 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-racing-orange focus:outline-none focus:border-racing-orange"
                      />
                    </td>

                    {/* Customer Preview */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="font-mono font-bold text-white">
                        {formatPrice(effectivePrice)}
                      </div>
                      {discount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400 block">
                          Save {discount}%
                        </span>
                      )}
                    </td>

                    {/* Save Button */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveRow(p)}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-pitstop-800 hover:bg-racing-orange text-zinc-200 hover:text-black font-bold text-xs uppercase rounded-lg border border-pitstop-700 hover:border-racing-orange transition-colors flex items-center space-x-1.5 ml-auto"
                      >
                        {isSaving ? (
                          <span>...</span>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
