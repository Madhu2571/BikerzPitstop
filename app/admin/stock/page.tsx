'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  Plus, 
  Minus, 
  Check, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ExternalLink,
  Save,
  RotateCcw
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outofstock'>('all');
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});
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
          // Initialize local stock inputs
          const stockMap: Record<string, number> = {};
          data.products.forEach((p: Product) => {
            stockMap[p.id] = p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0);
          });
          setEditingStocks(stockMap);
        }
      }
    } catch (err) {
      console.error('Failed to load stock data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockInputChange = (productId: string, val: number) => {
    setEditingStocks((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleQuickAdjust = (productId: string, delta: number) => {
    const current = editingStocks[productId] !== undefined ? editingStocks[productId] : 10;
    const nextVal = Math.max(0, current + delta);
    setEditingStocks((prev) => ({
      ...prev,
      [productId]: nextVal,
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = editingStocks[product.id] ?? 0;
    setSavingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
        setSavedFeedback(`Saved stock for ${product.name}: ${newStock} units`);
        setTimeout(() => setSavedFeedback(null), 3000);
      } else {
        alert(data.error || 'Failed to update stock');
      }
    } catch (err) {
      alert('Error updating stock');
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
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      const stock = editingStocks[p.id] ?? (p.stockQuantity ?? 10);
      if (stockFilter === 'instock' && stock <= 0) return false;
      if (stockFilter === 'outofstock' && stock > 0) return false;
      if (stockFilter === 'lowstock' && (stock <= 0 || stock > 3)) return false;

      return true;
    });
  }, [products, searchQuery, stockFilter, editingStocks]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Stock &amp; Inventory Management
        </h1>
        <p className="text-xs text-pitstop-400 mt-1">
          Directly set exact stock levels or quick increment/decrement inventory. Zero stock items automatically trigger WhatsApp availability requests on the customer storefront.
        </p>
      </div>

      {/* Real-time Business Logic Rules Card */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start space-x-3 p-3 bg-pitstop-950 rounded-xl border border-emerald-900/50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-300 block font-bold">In-Stock Condition (Quantity &gt; 0)</strong>
            <p className="text-pitstop-300 text-[11px] mt-0.5">
              Customer website shows &ldquo;In Stock&rdquo; with normal Add-to-Cart and instant &ldquo;Buy Now on WhatsApp&rdquo; buttons.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-pitstop-950 rounded-xl border border-red-900/50">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-red-300 block font-bold">Out-of-Stock Condition (Quantity = 0)</strong>
            <p className="text-pitstop-300 text-[11px] mt-0.5">
              Customer website disables direct purchasing, displays &ldquo;OUT OF STOCK&rdquo;, and changes the CTA to &ldquo;Ask Availability on WhatsApp&rdquo;.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {savedFeedback && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products to adjust inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-pitstop-850 border border-pitstop-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
          />
          <Search className="w-4 h-4 text-pitstop-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              stockFilter === 'all'
                ? 'bg-racing-orange text-black'
                : 'bg-pitstop-850 text-zinc-300 hover:text-white'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStockFilter('instock')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              stockFilter === 'instock'
                ? 'bg-emerald-600 text-white'
                : 'bg-pitstop-850 text-emerald-400 hover:text-white'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setStockFilter('lowstock')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              stockFilter === 'lowstock'
                ? 'bg-amber-600 text-white'
                : 'bg-pitstop-850 text-amber-400 hover:text-white'
            }`}
          >
            Low Stock (&le;3)
          </button>
          <button
            onClick={() => setStockFilter('outofstock')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
              stockFilter === 'outofstock'
                ? 'bg-red-600 text-white'
                : 'bg-pitstop-850 text-red-400 hover:text-white'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pitstop-950 text-pitstop-400 font-bold uppercase tracking-wider border-b border-pitstop-800 text-[10px]">
              <tr>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-6 py-3 text-center">Adjust Stock Quantity</th>
                <th className="px-4 py-3 text-center">Store Status</th>
                <th className="px-5 py-3 text-right">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitstop-800/60 text-zinc-300">
              {filteredProducts.map((p) => {
                const currentStock = editingStocks[p.id] !== undefined ? editingStocks[p.id] : 0;
                const isSavedMatch = (p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0)) === currentStock;
                const isOutOfStock = currentStock === 0;
                const isLowStock = currentStock > 0 && currentStock <= 3;
                const isSaving = savingId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-pitstop-850/50 transition-colors">
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
                          <span className="font-bold text-white block truncate max-w-sm">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-racing-orange uppercase font-semibold">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-pitstop-400">
                      {p.category}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-white">
                      {formatPrice(p.price)}
                    </td>

                    {/* Stock Controls */}
                    <td className="px-6 py-3.5 text-center">
                      <div className="inline-flex items-center space-x-2 bg-pitstop-950 border border-pitstop-700/80 rounded-xl p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, -1)}
                          disabled={currentStock <= 0}
                          className="p-1.5 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white rounded-lg disabled:opacity-30"
                          title="Decrease by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min={0}
                          value={currentStock}
                          onChange={(e) => handleStockInputChange(p.id, Number(e.target.value))}
                          className={`w-16 text-center bg-pitstop-900 border border-pitstop-700 rounded-lg py-1 text-xs font-mono font-black focus:outline-none focus:border-racing-orange ${
                            isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => handleQuickAdjust(p.id, 1)}
                          className="p-1.5 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white rounded-lg"
                          title="Increase by 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status Display */}
                    <td className="px-4 py-3.5 text-center">
                      {isOutOfStock ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-red-950 text-red-300 border border-red-800">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-800">
                          LOW ({currentStock} left)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                          AVAILABLE ({currentStock})
                        </span>
                      )}
                    </td>

                    {/* Save Action */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveStock(p)}
                        disabled={isSaving}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center space-x-1.5 ml-auto ${
                          !isSavedMatch
                            ? 'bg-racing-orange hover:bg-racing-amber text-black font-black shadow-md animate-pulse'
                            : 'bg-pitstop-800 text-zinc-400 hover:text-white border border-pitstop-700'
                        }`}
                      >
                        {isSaving ? (
                          <span>Saving...</span>
                        ) : !isSavedMatch ? (
                          <>
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Saved</span>
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
