import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AskBikerzWidget from '@/components/AskBikerzWidget';
import { BUSINESS_CONFIG } from '@/data/business';

export const metadata: Metadata = {
  title: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
  description: `Genuine motorcycle accessories, crash guards, fog lights, and ECE certified helmets in Ramanathapuram, Coimbatore. Order directly via WhatsApp at ${BUSINESS_CONFIG.phone}.`,
  keywords: [
    'Bikerz Pitstop Coimbatore',
    'Motorcycle Accessories Coimbatore',
    'Helmets Coimbatore',
    'Axor helmets',
    'MT Thunder 4',
    'Himalayan 450 crash guard',
    'Maddog fog lights',
    'Bike accessories Ramanathapuram',
  ],
  openGraph: {
    title: `${BUSINESS_CONFIG.name} Coimbatore`,
    description: BUSINESS_CONFIG.tagline,
    url: 'https://bikerspitstop.com',
    siteName: BUSINESS_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-pitstop-950 text-zinc-100 flex flex-col selection:bg-racing-orange selection:text-black">
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
          <AskBikerzWidget />
        </CartProvider>
      </body>
    </html>
  );
}
