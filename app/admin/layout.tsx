'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Layers, 
  Tag, 
  LogOut, 
  ExternalLink, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>('admin@bikerzpitstop.com');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/admin/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.email) {
            setAdminEmail(data.email);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  // If on login page, render clean layout without admin navbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Add Product', href: '/admin/products/new', icon: <PlusCircle className="w-4 h-4" /> },
    { name: 'Stock Management', href: '/admin/stock', icon: <Layers className="w-4 h-4" /> },
    { name: 'Offers & Pricing', href: '/admin/offers', icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-pitstop-950 text-zinc-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-pitstop-900 border-b border-pitstop-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="bg-racing-orange text-black font-black text-sm px-2 py-0.5 rounded transform -skew-x-6">
                  BP
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white uppercase tracking-wider">
                    BIKERZ <span className="text-racing-orange">ADMIN</span>
                  </span>
                  <span className="text-[10px] bg-pitstop-800 text-racing-orange font-bold px-2 py-0.5 rounded border border-pitstop-700">
                    Console
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-racing-orange text-black font-black'
                          : 'text-zinc-300 hover:text-white hover:bg-pitstop-850'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right User & Actions */}
            <div className="flex items-center space-x-3">
              {/* Authenticated email tag */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-pitstop-400 font-semibold uppercase tracking-wider">
                  Signed in as
                </span>
                <span className="text-xs font-mono font-bold text-racing-orange truncate max-w-[180px]">
                  {adminEmail}
                </span>
              </div>

              {/* View Customer Website Link */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-pitstop-850 hover:bg-pitstop-800 text-zinc-300 hover:text-white rounded-lg border border-pitstop-700 text-xs font-bold transition-colors"
                title="Open customer storefront in new tab"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white rounded-lg border border-red-800/80 text-xs font-bold transition-colors"
                title="Sign out of admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-pitstop-850 border border-pitstop-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-pitstop-950 border-b border-pitstop-800 p-4 space-y-2">
            <div className="p-2 bg-pitstop-900 rounded-lg text-xs font-mono text-racing-orange truncate mb-3">
              Admin: {adminEmail}
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-racing-orange text-black'
                      : 'text-zinc-300 hover:bg-pitstop-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-pitstop-800">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white"
              >
                <span>View Customer Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
