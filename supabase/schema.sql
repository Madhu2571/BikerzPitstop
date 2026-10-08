-- ========================================================
-- BIKERZ PITSTOP COIMBATORE - SUPABASE PRODUCTION DATABASE SCHEMA
-- ========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  mrp NUMERIC NOT NULL CHECK (mrp >= 0),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  compatible_bikes JSONB NOT NULL DEFAULT '["Universal"]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colours JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  availability TEXT NOT NULL DEFAULT 'in_stock',
  stock_quantity INTEGER NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
  published BOOLEAN NOT NULL DEFAULT true,
  on_offer BOOLEAN NOT NULL DEFAULT false,
  offer_price NUMERIC DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  new_arrival BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  badge TEXT,
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(published);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public storefront customers) to read published products
CREATE POLICY "Public can view published products"
  ON public.products
  FOR SELECT
  USING (published = true);

-- Allow service_role key full CRUD permissions (Server-side Admin APIs)
CREATE POLICY "Service role full access on products"
  ON public.products
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Supabase Storage: Product Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to product images
CREATE POLICY "Public read product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow service_role to upload and delete product images
CREATE POLICY "Service role upload product images"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');
