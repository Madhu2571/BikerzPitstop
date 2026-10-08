'use client';

import React, { useState } from 'react';
import { X, Send, HelpCircle, Bike, Tag } from 'lucide-react';
import { getProductRequestWhatsAppUrl } from '@/lib/whatsapp';

interface ProductRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBikeModel?: string;
}

export default function ProductRequestModal({
  isOpen,
  onClose,
  initialBikeModel = '',
}: ProductRequestModalProps) {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [bikeModel, setBikeModel] = useState(initialBikeModel);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const url = getProductRequestWhatsAppUrl({
      productName: productName.trim(),
      brand: brand.trim() || undefined,
      bikeModel: bikeModel.trim() || undefined,
      message: message.trim() || undefined,
    });

    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-pitstop-900 border border-pitstop-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-pitstop-950 border-b border-pitstop-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-racing-orange/10 text-racing-orange rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Can&apos;t Find What You Need?
              </h3>
              <p className="text-xs text-pitstop-400">
                Request any motorcycle accessory, helmet, or spare part
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-pitstop-400 hover:text-white rounded-lg hover:bg-pitstop-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Product Name / Description <span className="text-racing-orange">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Barkbusters handguards, Shad top box, Carbon visor..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Brand (if known)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Axor, Zana, MT, Maddog"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
                />
                <Tag className="w-4 h-4 text-pitstop-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Bike Model
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Himalayan 450, Duke 390"
                  value={bikeModel}
                  onChange={(e) => setBikeModel(e.target.value)}
                  className="w-full bg-pitstop-850 border border-pitstop-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
                />
                <Bike className="w-4 h-4 text-pitstop-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Additional Details / Specifications
            </label>
            <textarea
              rows={3}
              placeholder="Mention size, colour, part number, or how quickly you need it..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
            />
          </div>

          <div className="bg-pitstop-950 p-3 rounded-lg border border-pitstop-800 text-xs text-pitstop-400 flex items-start space-x-2">
            <span className="text-racing-orange font-bold">ℹ️</span>
            <span>
              This will send your request directly to the Bikerz Pitstop team on WhatsApp. We check stock and warehouse sourcing instantly!
            </span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
