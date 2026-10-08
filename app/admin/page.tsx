'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Tag, 
  PlusCircle, 
  ArrowRight, 
  Layers, 
  Search,
  ExternalLink,
  Edit,
  Flame
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/whatsapp';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error('Failed to load products for dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  // KPIs
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => (p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0)) > 0);
  const outOfStockProducts = products.filter((p) => (p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0)) === 0);
  const lowStockProducts = products.filter((p) => {
    const stock = p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0);
    return stock > 0 && stock <= 3;
  });
  const onOfferProducts = products.filter((p) => p.onOffer);

  const recentProducts = products.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Welcome & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Inventory &amp; Operations Dashboard
          </h1>
          <p className="text-xs text-pitstop-400 mt-1">
            Real-time stock monitoring, pricing management, and product catalogue controls for Bikerz Pitstop Coimbatore.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-pitstop-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {isLoading ? '...' : totalProducts}
          </div>
          <Link href="/admin/products" className="text-[10px] text-racing-orange hover:underline font-bold mt-2">
            View Catalogue &rarr;
          </Link>
        </div>

        {/* In Stock */}
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Stock</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {isLoading ? '...' : inStockProducts.length}
          </div>
          <span className="text-[10px] text-pitstop-400 mt-2">Customer Orderable</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {isLoading ? '...' : outOfStockProducts.length}
          </div>
          <span className="text-[10px] text-pitstop-400 mt-2">Triggers WhatsApp Ask</span>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock (&le;3)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {isLoading ? '...' : lowStockProducts.length}
          </div>
          <Link href="/admin/stock" className="text-[10px] text-amber-400 hover:underline font-bold mt-2">
            Restock Soon &rarr;
          </Link>
        </div>

        {/* Active Offers */}
        <div className="bg-pitstop-900 border border-pitstop-800 rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-racing-orange mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Offers</span>
            <Tag className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {isLoading ? '...' : onOfferProducts.length}
          </div>
          <Link href="/admin/offers" className="text-[10px] text-racing-orange hover:underline font-bold mt-2">
            Manage Discounts &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products/new"
          className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/80 rounded-xl p-5 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pitstop-850 rounded-xl text-racing-orange group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase">Add New Product</h3>
              <p className="text-[11px] text-pitstop-400">Helmets, Crash Guards, Lighting</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pitstop-500 group-hover:text-racing-orange transition-colors" />
        </Link>

        <Link
          href="/admin/stock"
          className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/80 rounded-xl p-5 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pitstop-850 rounded-xl text-amber-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase">Stock Management</h3>
              <p className="text-[11px] text-pitstop-400">Update quantities with 1 click</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pitstop-500 group-hover:text-amber-400 transition-colors" />
        </Link>

        <Link
          href="/admin/offers"
          className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/80 rounded-xl p-5 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pitstop-850 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase">Offers &amp; Pricing</h3>
              <p className="text-[11px] text-pitstop-400">Toggle sales &amp; discount rates</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pitstop-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Inventory Table */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-pitstop-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-racing-orange" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Inventory Overview
            </h2>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-racing-orange hover:underline font-bold uppercase tracking-wider"
          >
            View All ({totalProducts}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pitstop-950 text-pitstop-400 font-bold uppercase tracking-wider border-b border-pitstop-800 text-[10px]">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price / MRP</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitstop-800/60 text-zinc-300">
              {recentProducts.map((p) => {
                const stock = p.stockQuantity ?? (p.availability === 'in_stock' ? 10 : 0);
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock <= 3;

                return (
                  <tr key={p.id} className="hover:bg-pitstop-850/60 transition-colors">
                    <td className="px-5 py-3">
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
                    <td className="px-4 py-3 text-pitstop-400">
                      {p.category} &bull; {p.subCategory}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-white">
                        {formatPrice(p.price)}
                      </div>
                      {p.mrp > p.price && (
                        <div className="text-[10px] text-pitstop-500 line-through">
                          {formatPrice(p.mrp)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      <span className={isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'}>
                        {stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isOutOfStock ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/80">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                          In Stock
                        </span>
                      )}
                      {p.onOffer && (
                        <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-racing-orange text-black">
                          OFFER
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 bg-pitstop-800 hover:bg-pitstop-700 text-zinc-300 hover:text-white rounded border border-pitstop-700 transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-pitstop-800 hover:bg-pitstop-700 text-pitstop-400 hover:text-racing-orange rounded border border-pitstop-700 transition-colors"
                          title="View on customer store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
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
