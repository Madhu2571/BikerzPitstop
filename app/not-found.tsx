import Link from 'next/link';
import { ArrowLeft, Bike, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="bg-pitstop-900 border border-pitstop-800 rounded-2xl p-8 sm:p-12 max-w-lg text-center space-y-5">
        <div className="w-16 h-16 bg-pitstop-850 rounded-full flex items-center justify-center mx-auto text-racing-orange">
          <Bike className="w-8 h-8" />
        </div>
        <span className="text-4xl sm:text-5xl font-black text-racing-orange tracking-tight">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Wrong Turn / Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-pitstop-300">
          The page or product you&apos;re looking for has moved or is not in our inventory. Let&apos;s get you back on track!
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-racing-orange hover:bg-racing-amber text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/shop"
            className="px-5 py-2.5 bg-pitstop-850 hover:bg-pitstop-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-pitstop-700 transition-colors flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
