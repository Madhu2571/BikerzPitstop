'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bot, MessageCircle, X, Sparkles, ArrowRight, Send } from 'lucide-react';
import { formatPrice } from '@/lib/whatsapp';
import { Product } from '@/types';

export default function AskBikerzWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    answer: string;
    products: Product[];
    escalationUrl?: string;
  } | null>(null);

  // Do not show widget on admin routes or if already on /ask-bikerz
  if (pathname.startsWith('/admin') || pathname === '/ask-bikerz') {
    return null;
  }

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ask-bikerz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse({
        answer: data.answer || '',
        products: data.recommendedProducts || [],
        escalationUrl: data.escalationUrl,
      });
    } catch (err) {
      setResponse({
        answer: 'Could not connect to the live catalogue right now. Please ask our Coimbatore store on WhatsApp.',
        products: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center space-x-2 bg-pitstop-900 hover:bg-pitstop-850 text-white pl-3.5 pr-4 py-2.5 rounded-full border border-pitstop-700 hover:border-racing-orange shadow-2xl shadow-black/80 transition-all hover:scale-105 active:scale-95"
          aria-label="Open Ask Bikerz AI Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-racing-orange text-black flex items-center justify-center font-black">
            <Bot className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black uppercase tracking-wider text-white group-hover:text-racing-orange transition-colors">
              Ask Bikerz AI
            </span>
            <span className="block text-[10px] text-pitstop-400 -mt-0.5">
              Live fitment &amp; budget advice
            </span>
          </div>
          <span className="sm:hidden text-xs font-bold text-racing-orange">AI</span>
        </button>
      </div>

      {/* Slide-up Quick Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] bg-pitstop-900 border border-pitstop-700/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 flex flex-col max-h-[550px]">
          
          {/* Header */}
          <div className="bg-pitstop-950 p-4 border-b border-pitstop-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-racing-orange text-black flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-1">
                  <span>Ask Bikerz</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Live</span>
                </h4>
                <p className="text-[11px] text-pitstop-400">Motorcycle shopping assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/ask-bikerz"
                onClick={() => setIsOpen(false)}
                className="text-xs text-racing-orange hover:underline font-semibold"
              >
                Full screen
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-pitstop-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs text-zinc-300">
            {!response ? (
              <div className="space-y-3">
                <p className="text-pitstop-300">
                  Ask me anything about budget, bike compatibility, or product comparisons using our real Coimbatore inventory!
                </p>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-pitstop-500">Quick Questions:</span>
                  {[
                    "I have ₹2,000. What should I buy?",
                    "What accessories fit Yamaha MT-15?",
                    "Which phone holder is better: BOBO or Motowolf?",
                    "Best touring accessories under ₹5,000",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(q);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white border border-pitstop-750 transition-colors truncate text-[11px]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-pitstop-950 p-3 rounded-xl border border-pitstop-800 leading-relaxed whitespace-pre-wrap text-[11px]">
                  {response.answer}
                </div>

                {response.products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-racing-orange uppercase">Matching Store Products:</span>
                    <div className="space-y-1.5">
                      {response.products.slice(0, 2).map((p) => (
                        <div key={p.id} className="p-2 bg-pitstop-850 rounded-lg border border-pitstop-750 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-white truncate text-[11px]">{p.name}</p>
                            <p className="text-[10px] text-pitstop-400">{p.brand} • <span className="text-racing-orange font-bold">{formatPrice(p.price)}</span></p>
                          </div>
                          <Link
                            href={`/product/${p.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="shrink-0 px-2 py-1 bg-racing-orange text-black rounded font-bold text-[10px]"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {response.escalationUrl && (
                  <a
                    href={response.escalationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                  >
                    Ask Bikerz Pitstop on WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleAsk} className="p-3 bg-pitstop-950 border-t border-pitstop-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask Ask Bikerz AI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-pitstop-900 border border-pitstop-700 rounded-lg px-3 py-2 text-xs text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="p-2 bg-racing-orange text-black rounded-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
