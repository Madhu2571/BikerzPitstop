import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  MessageCircle, 
  Navigation, 
  Shield, 
  Bike, 
  ExternalLink 
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';

export default function Footer() {
  return (
    <footer className="bg-pitstop-950 border-t border-pitstop-800 text-pitstop-300">
      {/* Action Bar */}
      <div className="bg-pitstop-900 border-b border-pitstop-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider">
              Ready to Upgrade Your Ride?
            </h4>
            <p className="text-xs text-pitstop-400">
              Direct consultation, genuine stock checks, and instant WhatsApp response from our Coimbatore workshop.
            </p>
          </div>

          {/* Core Action Buttons required by prompt */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={BUSINESS_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md hover:shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            <a
              href={BUSINESS_CONFIG.phoneLink}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-pitstop-800 hover:bg-pitstop-700 text-white font-bold text-xs uppercase tracking-wide border border-pitstop-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-racing-orange" />
              <span>Call: {BUSINESS_CONFIG.phone}</span>
            </a>

            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wide transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>

            <a
              href={BUSINESS_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wide transition-all shadow-md hover:shadow-racing-orange/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GET DIRECTIONS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Store Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-racing-orange text-black font-black text-xl px-2 py-0.5 rounded transform -skew-x-6">
                BP
              </div>
              <span className="text-xl font-black text-white tracking-wider uppercase font-sans">
                BIKERZ<span className="text-racing-orange ml-1">PITSTOP</span>
              </span>
            </div>
            <p className="text-xs text-pitstop-400 leading-relaxed">
              Coimbatore&apos;s trusted destination for genuine premium motorcycle helmets, adventure touring accessories, crash protection, and high-performance lighting.
            </p>
            <div className="pt-2 text-xs text-pitstop-400 space-y-1.5">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-racing-orange" />
                <span>Mon - Sat: {BUSINESS_CONFIG.hours.weekdays}</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-racing-orange" />
                <span>Sun: {BUSINESS_CONFIG.hours.sunday}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-pitstop-800 pb-2">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/helmets" className="hover:text-racing-orange transition-colors">
                  Helmets (Full Face, Modular, ADV)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Motorcycle+Accessories&subCategory=Crash+Guards" className="hover:text-racing-orange transition-colors">
                  Crash Guards & Sliders
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Motorcycle+Accessories&subCategory=Hand+Guards" className="hover:text-racing-orange transition-colors">
                  Hand Guards & Barkbusters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Motorcycle+Accessories&subCategory=Mobile+Holders" className="hover:text-racing-orange transition-colors">
                  Mobile Holders & Dampeners
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Lighting" className="hover:text-racing-orange transition-colors">
                  Auxiliary Fog Lights & LEDs
                </Link>
              </li>
              <li>
                <Link href="/shop-by-bike" className="text-racing-orange font-semibold hover:underline">
                  Shop Compatible by Bike &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Rider Tools & Customization */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-pitstop-800 pb-2">
              Rider Tools &amp; Build
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/fit-my-bike" className="text-racing-orange font-bold hover:underline flex items-center space-x-1">
                  <span>🏍️ Will This Fit My Bike?</span>
                </Link>
              </li>
              <li>
                <Link href="/build-my-bike" className="text-racing-orange font-bold hover:underline flex items-center space-x-1">
                  <span>🏗️ Build My Bike Setup</span>
                </Link>
              </li>
              <li>
                <Link href="/emergency-kit" className="text-red-400 font-bold hover:underline flex items-center space-x-1">
                  <span>🚨 Emergency Rider Kit</span>
                </Link>
              </li>
              <li>
                <Link href="/ask-bikerz" className="text-emerald-400 font-bold hover:underline flex items-center space-x-1">
                  <span>🤖 Ask Bikerz AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/shop-by-bike" className="hover:text-racing-orange transition-colors">
                  Shop by Bike Compatibility
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-racing-orange transition-colors">
                  Help &amp; Size Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Info (Mandatory prompt fields) */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-pitstop-800 pb-2">
              Visit Coimbatore Store
            </h5>
            <div className="flex items-start space-x-2.5 text-xs text-zinc-300">
              <MapPin className="w-4 h-4 text-racing-orange shrink-0 mt-0.5" />
              <span>{BUSINESS_CONFIG.address}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
              <Phone className="w-4 h-4 text-racing-orange shrink-0" />
              <a href={BUSINESS_CONFIG.phoneLink} className="hover:text-white">
                {BUSINESS_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
              <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {BUSINESS_CONFIG.instagramHandle}
              </a>
            </div>
            <div className="pt-2">
              <a
                href={BUSINESS_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-2 px-3 rounded bg-pitstop-800 hover:bg-pitstop-700 border border-pitstop-700 text-racing-orange font-bold text-xs uppercase transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions on Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-12 pt-6 border-t border-pitstop-800 text-center sm:flex sm:justify-between sm:text-left text-xs text-pitstop-500">
          <p>© {new Date().getFullYear()} Bikerz Pitstop Coimbatore. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex items-center justify-center sm:justify-end space-x-3">
            <span>In-store pickup & courier dispatch.</span>
            <span>&bull;</span>
            <Link href="/admin" className="text-pitstop-500 hover:text-racing-orange transition-colors">
              Store Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
