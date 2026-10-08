'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      // Successful login
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-pitstop-900 border border-pitstop-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-racing-orange/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-pitstop-850 rounded-2xl border border-pitstop-700/80 mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-racing-orange" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Bikerz Pitstop Admin
          </h1>
          <p className="text-xs text-pitstop-400 mt-1">
            Secure inventory &amp; product management console
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="mb-6 p-3 bg-pitstop-950 border border-pitstop-800 rounded-xl text-[11px] text-pitstop-400 flex items-start space-x-2">
          <span className="text-racing-orange font-bold text-xs mt-0.5">🔒</span>
          <span>
            Only the approved administrator email address configured for Bikerz Pitstop is authorized to sign in.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/80 border border-red-700/80 rounded-xl text-xs text-red-200 flex items-start space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@bikerzpitstop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
              />
              <Mail className="w-4 h-4 text-pitstop-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-pitstop-850 border border-pitstop-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-pitstop-500 focus:outline-none focus:border-racing-orange"
              />
              <Lock className="w-4 h-4 text-pitstop-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-racing-orange hover:bg-racing-amber disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-racing-orange/20 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-pitstop-800 text-center">
          <a
            href="/"
            className="text-xs text-pitstop-400 hover:text-white transition-colors"
          >
            &larr; Return to Customer Store
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center text-xs text-pitstop-400">
        Loading admin console...
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
