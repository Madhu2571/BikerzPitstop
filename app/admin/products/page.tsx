'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Search, 
  Filter, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  X
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

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
        }
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Toggle Published / Hidden
  const handleTogglePublish = async (product: Product) => {
    const nextPublished = product.published === false ? true : false;
    try {
      const res = await fetch(`/api/admin/products/${product.id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, published: nextPublished } : p))
        );
        showSuccess(`Product ${nextPublished ? 'published to store' : 'hidden from customer store'}`);
      }
    } catch (err) {
      alert('Failed to update visibility');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (product: Product) => {
    const nextFeatured = !product.featured;
    try {
      const res = await fetch(`/api/admin/products/${product.id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, featured: nextFeatured } : p))
        );
        showSuccess(`Product ${nextFeatured ? 'marked as Featured' : 'unmarked from Featured'}`);
      }
    } catch (err) {
      alert('Failed to update featured status');
    }
  };

  // Delete product confirmation
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        showSuccess(`Deleted "${productToDelete.name}" permanently`);
        setProductToDelete(null);
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesBike = p.compatibleBikes.some((b) => b.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesBike) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      const stock = p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0);
      if (selectedStockFilter === 'InStock' && stock <= 0) return false;
      if (selectedStockFilter === 'OutOfStock' && stock > 0) return false;
      if (selectedStockFilter === 'LowStock' && (stock <= 0 || stock > 3)) return false;
      if (selectedStockFilter === 'OnOffer' && !p.onOffer) return false;
      if (selectedStockFilter === 'Hidden' && p.published !== false) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStockFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-pitstop-400 mt-1">
            Create, edit, toggle visibility, and adjust inventory across the entire Bikerz Pitstop catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Success Banner */}
      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
            {actionSuccessMessage}
          </span>
          <button onClick={() => setActionSuccessMessage(null)}>
            <X className="w-3.5 h-3.5 text-emerald-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by name, brand, category, compatible bike..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-pitstop-850 border border-pitstop-700/80 rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-pitstop-400 focus:outline-none focus:border-racing-orange"
          />
          <Search className="w-4 h-4 text-pitstop-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-pitstop-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-racing-orange font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Helmets">Helmets</option>
            <option value="Motorcycle Accessories">Motorcycle Accessories</option>
            <option value="Lighting">Lighting</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
            className="bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-racing-orange font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="InStock">In Stock Only</option>
            <option value="OutOfStock">Out of Stock Only</option>
            <option value="LowStock">Low Stock (&le;3)</option>
            <option value="OnOffer">On Active Offer</option>
            <option value="Hidden">Hidden / Unpublished</option>
          </select>
        </div>
      </div>

      {/* Table Results */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-pitstop-950 border-b border-pitstop-800 flex items-center justify-between text-xs text-pitstop-400">
          <span>
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} products
          </span>
          {filteredProducts.length !== products.length && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStockFilter('All'); }}
              className="text-racing-orange hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pitstop-950 text-pitstop-400 font-bold uppercase tracking-wider border-b border-pitstop-800 text-[10px]">
              <tr>
                <th className="px-5 py-3">Product Info</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price &amp; MRP</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Visibility</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitstop-800/60 text-zinc-300">
              {filteredProducts.map((p) => {
                const stock = p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0);
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock <= 3;
                const isPublished = p.published !== false;

                return (
                  <tr key={p.id} className="hover:bg-pitstop-850/50 transition-colors">
                    {/* Product Info */}
                    <td className="px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-11 h-11 bg-pitstop-950 rounded-lg overflow-hidden shrink-0 border border-pitstop-800">
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
                          <div className="flex items-center space-x-2 text-[10px]">
                            <span className="text-racing-orange uppercase font-bold">{p.brand}</span>
                            <span className="text-pitstop-500">&bull;</span>
                            <span className="text-pitstop-400 truncate max-w-[140px]">
                              {p.compatibleBikes.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-pitstop-400">
                      <span className="block font-semibold text-zinc-300">{p.category}</span>
                      <span className="text-[10px] text-pitstop-500">{p.subCategory}</span>
                    </td>

                    {/* Price & Offer */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-white">
                        {formatPrice(p.price)}
                      </div>
                      {p.mrp > p.price && (
                        <div className="text-[10px] text-pitstop-500 line-through">
                          {formatPrice(p.mrp)}
                        </div>
                      )}
                      {p.onOffer && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-racing-orange text-black">
                          ON OFFER
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`font-mono font-bold ${
                          isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {stock} in stock
                        </span>
                      </div>
                      {isOutOfStock ? (
                        <span className="text-[10px] text-red-400 block font-semibold">
                          (Shows WhatsApp Ask)
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 block font-semibold">
                          (Live on Store)
                        </span>
                      )}
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded transition-colors ${
                          p.featured
                            ? 'text-racing-yellow bg-amber-950/60 border border-amber-800'
                            : 'text-pitstop-600 hover:text-zinc-400'
                        }`}
                        title={p.featured ? 'Featured on homepage (click to remove)' : 'Mark as featured on homepage'}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-racing-yellow' : ''}`} />
                      </button>
                    </td>

                    {/* Visibility toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          isPublished
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : 'bg-pitstop-800 text-pitstop-400 border border-pitstop-700'
                        }`}
                        title={isPublished ? 'Click to hide from store' : 'Click to publish to store'}
                      >
                        {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isPublished ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white rounded border border-pitstop-700 transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-pitstop-850 hover:bg-pitstop-800 text-pitstop-400 hover:text-racing-orange rounded border border-pitstop-700 transition-colors"
                          title="Preview in customer store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-400 hover:text-red-200 rounded border border-red-800/60 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-pitstop-900 border border-pitstop-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-red-950/80 rounded-full flex items-center justify-center mx-auto text-red-400 border border-red-800">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-pitstop-300 mt-2">
                Are you sure you want to permanently delete:
              </p>
              <div className="p-3 bg-pitstop-950 border border-pitstop-800 rounded-lg text-xs font-bold text-racing-orange mt-2">
                {productToDelete.name}
              </div>
              <p className="text-[11px] text-pitstop-400 mt-2">
                This action cannot be undone. Normal customers will no longer see this product.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 bg-pitstop-800 hover:bg-pitstop-700 text-zinc-300 text-xs font-bold uppercase rounded-lg border border-pitstop-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                {isDeleting ? <span>Deleting...</span> : <span>Delete Permanently</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
