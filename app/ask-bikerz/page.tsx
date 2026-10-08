'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Bike, 
  MessageCircle, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  User
} from 'lucide-react';
import { POPULAR_BIKE_BRANDS } from '@/data/bikes';
import { useCart } from '@/context/CartContext';
import { formatPrice, getBuyNowWhatsAppUrl, getOutOfStockWhatsAppUrl } from '@/lib/whatsapp';
import { Product } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendedProducts?: Product[];
  escalationUrl?: string;
  suggestedQueries?: string[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "I have ₹2,000. What should I buy?",
  "I have an MT-15. What accessories fit?",
  "I have a Duke 200, ride to college, budget ₹1,500",
  "Which phone holder is better: BOBO or Motowolf?",
  "What do customers think about the Axor Apex helmet?",
  "Best accessories under ₹1,000",
  "I want touring accessories for my bike",
  "Emergency kit for highway rides",
];

export default function AskBikerzPage() {
  const { addToCart } = useCart();
  const [currentBike, setCurrentBike] = useState<string>('Yamaha MT-15 V2');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hi rider! 👋 I am **Ask Bikerz**, your AI shopping assistant powered directly by Bikerz Pitstop's Coimbatore store catalogue.\n\n` +
        `I never fabricate products, fake reviews, or invent prices. I can help you with:\n` +
        `- 💰 **Budget Recommendations** *(e.g. "I have ₹2,000")*\n` +
        `- 🏍️ **Bike Compatibility** *(e.g. "What accessories fit my bike?")*\n` +
        `- ⚖️ **Product Comparisons** *(e.g. "Which phone holder is better?")*\n` +
        `- 📦 **Combined Intent** *(e.g. "Duke 200, daily commute, budget ₹1,500")*\n\n` +
        `Try typing a question below or tap one of the suggested prompts!`,
      suggestedQueries: [
        "I have ₹2,000. What should I buy?",
        "I have an MT-15. What accessories fit?",
        "Which phone holder is better: BOBO or Motowolf?",
      ],
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-bikerz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          currentBike,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error');
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer || 'Here is what I found in our catalogue:',
        recommendedProducts: data.recommendedProducts || [],
        escalationUrl: data.escalationUrl,
        suggestedQueries: data.suggestedQueries || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I'm having a momentary hiccup reaching the catalogue. You can chat directly with our Coimbatore store mechanics on WhatsApp!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat restarted! What motorcycle do you ride, or what are you looking for today?`,
        suggestedQueries: [
          "I have ₹2,000. What should I buy?",
          "I have an MT-15. What accessories fit?",
          "Best accessories under ₹1,000",
        ],
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-pitstop-950 text-white flex flex-col pb-16">
      
      {/* Header Banner */}
      <section className="bg-pitstop-900 border-b border-pitstop-800 py-6 sm:py-8 shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-racing-orange text-black flex items-center justify-center font-black text-xl shadow-lg shadow-racing-orange/20 shrink-0">
              <Bot className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Ask <span className="text-racing-orange">Bikerz</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live Catalogue AI
                </span>
              </div>
              <p className="text-xs text-pitstop-400 mt-0.5">
                Real Coimbatore inventory • Zero fabricated reviews • Honest fitment advice
              </p>
            </div>
          </div>

          {/* Quick Bike Context Dropdown */}
          <div className="flex items-center space-x-2 bg-pitstop-850 border border-pitstop-700/80 rounded-xl px-3 py-2 text-xs">
            <Bike className="w-4 h-4 text-racing-orange shrink-0" />
            <span className="text-pitstop-400 font-semibold hidden md:inline">My Bike:</span>
            <select
              value={currentBike}
              onChange={(e) => setCurrentBike(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-pitstop-900">Choose motorcycle...</option>
              {POPULAR_BIKE_BRANDS.flatMap((b) =>
                b.models.map((m) => (
                  <option key={m} value={`${b.brand} ${m}`} className="bg-pitstop-900">
                    {b.brand} {m}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={resetChat}
              className="text-pitstop-400 hover:text-white p-1 ml-1"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Chat Messages Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-pitstop-800 border border-pitstop-700 text-zinc-300'
                  : 'bg-racing-orange text-black font-black'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-racing-orange text-black font-semibold rounded-tr-none shadow-lg shadow-racing-orange/10'
                  : 'bg-pitstop-900 border border-pitstop-800 text-zinc-200 rounded-tl-none shadow-xl'
              }`}
            >
              {/* Message text with basic markdown formatting */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    {para.split('**').map((chunk, j) =>
                      j % 2 === 1 ? <strong key={j} className={msg.sender === 'user' ? 'font-black' : 'text-white font-bold'}>{chunk}</strong> : chunk
                    )}
                  </p>
                ))}
              </div>

              {/* Embedded Product Cards */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-pitstop-800/80 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-racing-orange">
                    Verified Store Matches ({msg.recommendedProducts.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.recommendedProducts.map((p) => {
                      const isOutOfStock = p.availability === 'out_of_stock' || (typeof p.stockQuantity === 'number' && p.stockQuantity <= 0);

                      return (
                        <div
                          key={p.id}
                          className="bg-pitstop-950 border border-pitstop-800 rounded-xl p-3 flex flex-col justify-between hover:border-pitstop-700 transition-all text-xs"
                        >
                          <div className="flex space-x-3">
                            <div className="relative w-16 h-16 bg-pitstop-900 rounded-lg overflow-hidden shrink-0 border border-pitstop-800">
                              {p.images && p.images[0] ? (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : null}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-racing-orange uppercase">
                                {p.brand}
                              </span>
                              <Link
                                href={`/product/${p.slug}`}
                                className="block font-bold text-white hover:text-racing-orange truncate"
                              >
                                {p.name}
                              </Link>
                              <div className="mt-1 flex items-baseline space-x-1.5">
                                <span className="font-black text-white">{formatPrice(p.price)}</span>
                                {p.mrp > p.price && (
                                  <span className="text-[10px] text-pitstop-400 line-through">
                                    {formatPrice(p.mrp)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-2.5 pt-2 border-t border-pitstop-850 flex items-center justify-between gap-2">
                            {!isOutOfStock ? (
                              <>
                                  <button
                                    onClick={() => addToCart(p, { quantity: 1, selectedBike: currentBike })}
                                    className="py-1 px-2.5 bg-pitstop-850 hover:bg-pitstop-800 text-white rounded font-bold text-[11px] border border-pitstop-700 flex items-center space-x-1"
                                >
                                  <ShoppingBag className="w-3 h-3 text-racing-orange" />
                                  <span>+ Cart</span>
                                </button>
                                <a
                                  href={getBuyNowWhatsAppUrl({ product: p, quantity: 1, selectedBike: currentBike })}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] flex items-center space-x-1"
                                >
                                  <MessageCircle className="w-3 h-3 fill-white" />
                                  <span>Buy WhatsApp</span>
                                </a>
                              </>
                            ) : (
                              <a
                                href={getOutOfStockWhatsAppUrl(p, { selectedBike: currentBike })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-center py-1 bg-pitstop-850 text-amber-300 rounded font-bold text-[11px] border border-pitstop-700"
                              >
                                Request on WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WhatsApp Escalation CTA Button */}
              {msg.escalationUrl && (
                <div className="mt-3 pt-3 border-t border-pitstop-800/80 flex items-center justify-between text-xs">
                  <span className="text-pitstop-400 text-[11px]">Need workshop confirmation?</span>
                  <a
                    href={msg.escalationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ask Bikerz Pitstop on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Suggested Follow-up queries */}
              {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
                <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedQueries.map((sq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sq)}
                      className="text-[11px] bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-full border border-pitstop-750 transition-colors"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              )}

              <span className={`block text-[10px] mt-2 ${msg.sender === 'user' ? 'text-black/60 text-right' : 'text-pitstop-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-pitstop-400 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-racing-orange text-black flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <span>Checking live catalogue &amp; verified bike specs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input + Quick Prompts */}
      <div className="bg-pitstop-900 border-t border-pitstop-800 pt-3 pb-4 px-4 sm:px-6 shrink-0">
        <div className="max-w-5xl mx-auto space-y-2.5">
          
          {/* Quick Prompt Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-pitstop-500 shrink-0">
              Suggestions:
            </span>
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="shrink-0 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-pitstop-700/60 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask about budget, compatibility, or gear (e.g. "What accessories fit my ${currentBike} under ₹2,000?")`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-pitstop-950 border border-pitstop-700 rounded-xl px-4 py-3 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-3 rounded-xl font-bold transition-all shadow-md ${
                inputText.trim() && !isLoading
                  ? 'bg-racing-orange text-black hover:bg-racing-amber shadow-racing-orange/20 cursor-pointer'
                  : 'bg-pitstop-800 text-pitstop-600 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[11px] text-center text-pitstop-500">
            Ask Bikerz only recommends genuine products available at Bikerz Pitstop, Coimbatore. Zero fabricated reviews or guessed fitments.
          </p>

        </div>
      </div>

    </div>
  );
}
