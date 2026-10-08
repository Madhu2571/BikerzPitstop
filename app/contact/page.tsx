'use client';

import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Wrench,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-racing-orange/10 border border-racing-orange/30 text-racing-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Coimbatore Workshop &amp; Retail</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Contact Bikerz Pitstop
        </h1>
        <p className="text-xs sm:text-sm text-pitstop-300 mt-3 leading-relaxed">
          Visit our showroom in Ramanathapuram, Coimbatore or reach out directly on WhatsApp for live inventory checks, superbike fitment guidance, and express courier dispatch.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Col 1 & 2: Contact Methods & Store Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp */}
            <a
              href={BUSINESS_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pitstop-900 border border-pitstop-800 hover:border-emerald-500 rounded-xl p-5 flex items-start space-x-4 transition-all group"
            >
              <div className="p-3 bg-emerald-950/80 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 fill-emerald-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Instant Response
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  WhatsApp Us
                </h3>
                <p className="text-xs text-pitstop-400 mt-1">
                  {BUSINESS_CONFIG.phoneDisplay}
                </p>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href={BUSINESS_CONFIG.phoneLink}
              className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange rounded-xl p-5 flex items-start space-x-4 transition-all group"
            >
              <div className="p-3 bg-pitstop-850 rounded-xl text-racing-orange group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-racing-orange uppercase tracking-widest block">
                  Voice Call
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-racing-orange transition-colors">
                  Call the Store
                </h3>
                <p className="text-xs text-pitstop-400 mt-1">
                  {BUSINESS_CONFIG.phone}
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pitstop-900 border border-pitstop-800 hover:border-pink-500 rounded-xl p-5 flex items-start space-x-4 transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl text-pink-400 group-hover:scale-105 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">
                  Follow Rides &amp; Stock
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors">
                  Instagram
                </h3>
                <p className="text-xs text-pitstop-400 mt-1">
                  {BUSINESS_CONFIG.instagramHandle}
                </p>
              </div>
            </a>

            {/* Directions Map */}
            <a
              href={BUSINESS_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange rounded-xl p-5 flex items-start space-x-4 transition-all group"
            >
              <div className="p-3 bg-racing-orange/10 rounded-xl text-racing-orange group-hover:scale-105 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-racing-orange uppercase tracking-widest block">
                  GPS Navigation
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-racing-orange transition-colors">
                  GET DIRECTIONS
                </h3>
                <p className="text-xs text-pitstop-400 mt-1">
                  Navigate with Google Maps
                </p>
              </div>
            </a>
          </div>

          {/* Store Address & Operating Hours Card */}
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Showroom Location &amp; Timings
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3 text-zinc-300">
                <MapPin className="w-5 h-5 text-racing-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-0.5">Physical Store Address:</strong>
                  <span className="text-zinc-200 leading-relaxed">{BUSINESS_CONFIG.address}</span>
                  <div className="mt-3">
                    <a
                      href={BUSINESS_CONFIG.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GET DIRECTIONS</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-pitstop-800 flex items-start space-x-3 text-zinc-300">
                <Clock className="w-5 h-5 text-racing-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-0.5">Working Hours:</strong>
                  <p>Monday – Saturday: <span className="text-white font-semibold">{BUSINESS_CONFIG.hours.weekdays}</span></p>
                  <p>Sunday: <span className="text-white font-semibold">{BUSINESS_CONFIG.hours.sunday}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* What We Offer In-Store */}
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              What to Expect at our Coimbatore Store
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-pitstop-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helmet head measurement &amp; precision sizing trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pinlock 70 &amp; visor anti-fog installation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct bike fitment checks for crash guards</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Auxiliary fog light beam pattern testing</span>
              </div>
            </div>
          </div>

        </div>

        {/* Col 3: Map Preview & Highlights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sticky top-28 space-y-5">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Google Maps Location
            </h4>
            
            {/* Visual Map card with clean Get Directions CTA */}
            <div className="relative aspect-[4/3] bg-pitstop-950 rounded-xl overflow-hidden border border-pitstop-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="p-3 bg-pitstop-900 rounded-full text-racing-orange border border-pitstop-700 animate-bounce">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Bikerz Pitstop Coimbatore
                </span>
                <span className="text-[11px] text-pitstop-400">
                  Ramanathapuram, Coimbatore
                </span>
              </div>
              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>

            <div className="text-xs text-pitstop-400 space-y-2 pt-2 border-t border-pitstop-800">
              <p className="flex items-center text-zinc-300">
                <span className="text-racing-orange mr-2">📍</span>
                Landmark: Near Keelakarai &amp; Ramanathapuram signal.
              </p>
              <p className="flex items-center text-zinc-300">
                <span className="text-racing-orange mr-2">🏍️</span>
                Motorcycle parking available right in front of the shop.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={BUSINESS_CONFIG.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
