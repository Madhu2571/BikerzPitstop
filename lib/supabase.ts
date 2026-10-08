import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '@/types';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Returns true if Supabase cloud credentials are provided in the environment
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl && 
    supabaseUrl.startsWith('https://') && 
    supabaseServiceKey && 
    supabaseServiceKey.length > 20
  );
}

// Server-side privileged Supabase client
let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedClient;
}

/**
 * Database row representation of Product (snake_case)
 */
export interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sub_category: string;
  price: number;
  mrp: number;
  images: any; // jsonb array
  description: string;
  specifications: any; // jsonb object
  compatible_bikes: any; // jsonb array
  sizes?: any;
  colours?: any;
  variants?: any;
  availability: string;
  stock_quantity: number;
  published: boolean;
  on_offer: boolean;
  offer_price: number;
  discount_percent: number;
  featured: boolean;
  new_arrival: boolean;
  popular: boolean;
  badge?: string | null;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Converts a database row (snake_case) to application Product (camelCase)
 */
export function rowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category as any,
    subCategory: row.sub_category as any,
    price: Number(row.price),
    mrp: Number(row.mrp),
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    description: row.description,
    specifications: typeof row.specifications === 'object' && row.specifications !== null 
      ? row.specifications 
      : (typeof row.specifications === 'string' ? JSON.parse(row.specifications) : {}),
    compatibleBikes: Array.isArray(row.compatible_bikes) 
      ? row.compatible_bikes 
      : (typeof row.compatible_bikes === 'string' ? JSON.parse(row.compatible_bikes) : ['Universal']),
    sizes: row.sizes ? (Array.isArray(row.sizes) ? row.sizes : JSON.parse(row.sizes)) : undefined,
    colours: row.colours ? (Array.isArray(row.colours) ? row.colours : JSON.parse(row.colours)) : undefined,
    variants: row.variants ? (Array.isArray(row.variants) ? row.variants : JSON.parse(row.variants)) : undefined,
    availability: (row.stock_quantity > 0 ? 'in_stock' : 'out_of_stock') as any,
    stockQuantity: Number(row.stock_quantity ?? 0),
    published: row.published !== false,
    onOffer: Boolean(row.on_offer),
    offerPrice: Number(row.offer_price || row.price),
    discountPercent: Number(row.discount_percent || 0),
    featured: Boolean(row.featured),
    newArrival: Boolean(row.new_arrival),
    popular: Boolean(row.popular),
    badge: row.badge || undefined,
    rating: row.rating ? Number(row.rating) : 4.8,
    reviewCount: row.review_count ? Number(row.review_count) : 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Converts application Product (camelCase) to database row (snake_case)
 */
export function productToRow(product: Product): DbProductRow {
  const stock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.availability === 'out_of_stock' ? 0 : 10);
  const availability = stock > 0 ? 'in_stock' : 'out_of_stock';

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    sub_category: product.subCategory,
    price: product.price,
    mrp: product.mrp,
    images: product.images || [],
    description: product.description,
    specifications: product.specifications || {},
    compatible_bikes: product.compatibleBikes || ['Universal'],
    sizes: product.sizes || [],
    colours: product.colours || [],
    variants: product.variants || [],
    availability,
    stock_quantity: stock,
    published: product.published !== false,
    on_offer: Boolean(product.onOffer),
    offer_price: product.offerPrice || product.price,
    discount_percent: product.discountPercent || (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0),
    featured: Boolean(product.featured),
    new_arrival: Boolean(product.newArrival),
    popular: Boolean(product.popular),
    badge: product.badge || null,
    rating: product.rating ?? 4.8,
    review_count: product.reviewCount ?? 0,
    created_at: product.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
