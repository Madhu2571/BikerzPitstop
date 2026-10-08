'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  ShieldCheck, 
  Bike, 
  Search, 
  ShoppingBag, 
  Send,
  Phone,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/data/business';
import { getHelpWhatsAppUrl } from '@/lib/whatsapp';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultMessage: string;
}

export default function HelpPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>('Help choosing a helmet');
  const [customQuery, setCustomQuery] = useState<string>('');

  const helpTopics: HelpTopic[] = [
    {
      id: 'helmet-choice',
      title: 'Help choosing a helmet',
      description: 'Get sizing recommendations, ECE 22.06 vs DOT advice, or cheek-pad fit tips.',
      icon: <ShieldCheck className="w-5 h-5 text-racing-orange" />,
      defaultMessage: 'I need guidance selecting the right helmet size and certification for my riding style.',
    },
    {
      id: 'bike-accessory',
      title: 'Help finding an accessory for my bike',
      description: 'Find crash guards, barkbusters, phone mounts, and LED kits compatible with your bike model.',
      icon: <Bike className="w-5 h-5 text-racing-amber" />,
      defaultMessage: 'I am looking for compatible accessories and crash protection for my motorcycle model.',
    },
    {
      id: 'product-enquiry',
      title: 'Product enquiry',
      description: 'Have a question about specifications, materials, warranty, or brand authentications?',
      icon: <HelpCircle className="w-5 h-5 text-racing-yellow" />,
      defaultMessage: 'I have a specific enquiry about a motorcycle product listed in your inventory.',
    },
    {
      id: 'product-availability',
      title: 'Product availability',
      description: 'Check if an out-of-stock color, visor, or size is arriving at our Coimbatore store.',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      defaultMessage: 'Could you please check current store stock or next arrival date for a product?',
    },
    {
      id: 'cant-find',
      title: "Can't find a product",
      description: 'Looking for a rare superbike slider, imported paddock stand, or special visor?',
      icon: <Search className="w-5 h-5 text-blue-400" />,
      defaultMessage: 'I am searching for a specific motorcycle part/gear that is not listed on your catalogue.',
    },
    {
      id: 'cart-order',
      title: 'Cart/order enquiry',
      description: 'Discuss payment options, in-store pickup schedule, or courier dispatch rates.',
      icon: <ShoppingBag className="w-5 h-5 text-purple-400" />,
      defaultMessage: 'I have a question regarding my order dispatch, pricing, or payment details.',
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Any other question or custom requirement for the Bikerz Pitstop team.',
      icon: <MessageCircle className="w-5 h-5 text-zinc-300" />,
      defaultMessage: 'I have a general question for Bikerz Pitstop Coimbatore.',
    },
  ];

  const handleOpenWhatsApp = (topicTitle: string, note?: string) => {
    const url = getHelpWhatsAppUrl(topicTitle, note || undefined);
    window.open(url, '_blank');
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenWhatsApp(selectedTopic, customQuery.trim() || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-racing-orange/10 border border-racing-orange/30 text-racing-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Rider Help Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-xs sm:text-sm text-pitstop-300 mt-3 leading-relaxed">
          No automated robots or ticket numbers. Click any topic below to chat directly with our Coimbatore motorcycle technicians and gear specialists on WhatsApp.
        </p>
      </div>

      {/* Grid of Help Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {helpTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-pitstop-900 border border-pitstop-800 hover:border-racing-orange/60 rounded-xl p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 bg-pitstop-850 rounded-lg group-hover:scale-105 transition-transform">
                  {topic.icon}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-racing-orange transition-colors">
                  {topic.title}
                </h3>
              </div>
              <p className="text-xs text-pitstop-400 leading-relaxed mb-4">
                {topic.description}
              </p>
            </div>

            <button
              onClick={() => handleOpenWhatsApp(topic.title, topic.defaultMessage)}
              className="w-full py-2.5 px-3 bg-pitstop-850 hover:bg-emerald-600 text-zinc-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-pitstop-700/80 hover:border-emerald-600 transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Ask via WhatsApp</span>
            </button>
          </div>
        ))}
      </div>

      {/* Quick Custom Query Form */}
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-6 sm:p-10 max-w-4xl">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
          Send a Detailed Query
        </h3>
        <p className="text-xs text-pitstop-400 mb-6">
          Specify your query or motorcycle model below. We will format a clean WhatsApp message and connect you directly.
        </p>

        <form onSubmit={handleSubmitCustom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Help Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-racing-orange"
              >
                {helpTopics.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Motorcycle Model (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Himalayan 450, Duke 390, Speed 400"
                className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-racing-orange"
                onChange={(e) => {
                  if (e.target.value) {
                    setCustomQuery((prev) => `${prev} (Bike: ${e.target.value})`);
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Your Question / Message
            </label>
            <textarea
              rows={3}
              placeholder="Describe your query, size requirement, or question..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="w-full bg-pitstop-850 border border-pitstop-700 text-white rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-racing-orange"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch WhatsApp with Query</span>
          </button>
        </form>
      </div>

      {/* Direct Contact Banner */}
      <div className="bg-pitstop-950 border border-pitstop-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-pitstop-900 rounded-xl text-racing-orange">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold uppercase">
              Prefer an Instant Phone Call?
            </h4>
            <p className="text-xs text-pitstop-400">
              Speak directly with our store manager during working hours ({BUSINESS_CONFIG.hours.weekdays}).
            </p>
          </div>
        </div>

        <a
          href={BUSINESS_CONFIG.phoneLink}
          className="px-5 py-2.5 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-pitstop-700 transition-colors whitespace-nowrap"
        >
          Call Store: {BUSINESS_CONFIG.phone}
        </a>
      </div>

    </div>
  );
}
