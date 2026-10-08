'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';

export default function FloatingWhatsApp() {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end space-x-3">
      {/* Friendly tooltip bubble on desktop */}
      {!tooltipDismissed && (
        <div className="hidden md:flex items-center bg-pitstop-900 border border-pitstop-700 text-white text-xs px-3 py-2 rounded-xl shadow-2xl space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="font-bold text-racing-orange">Chat with Bikerz Pitstop</span>
            <span className="text-[11px] text-pitstop-300">Quick product & stock inquiry</span>
          </div>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-pitstop-400 hover:text-white p-0.5 ml-1"
            aria-label="Dismiss chat tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={BUSINESS_CONFIG.whatsappBaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Chat on WhatsApp with Bikerz Pitstop"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-racing-orange rounded-full border-2 border-pitstop-900 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-racing-orange rounded-full border-2 border-pitstop-900"></span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
