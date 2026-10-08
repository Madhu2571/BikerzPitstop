import fs from 'fs';
import path from 'path';
import { Product } from '@/types';
import { PRODUCTS as INITIAL_SEED_PRODUCTS } from '@/data/products';
import { 
  getSupabaseClient, 
  isSupabaseConfigured, 
  rowToProduct, 
  productToRow, 
  DbProductRow 
} from '@/lib/supabase';

// Local storage file paths (fallback when Supabase is not yet configured)
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'products-db.json');
const TMP_DB_FILE_PATH = path.join('/tmp', 'bikerz-products-db.json');

// In-memory cache for local fallback
let memoryCache: Product[] | null = null;

/**
 * Returns seed products with initialized admin fields
 */
export function getInitialSeed(): Product[] {
  return INITIAL_SEED_PRODUCTS.map((p, index) => ({
    ...p,
    stockQuantity: p.availability === 'out_of_stock' ? 0 : 10,
    published: true,
    onOffer: p.badge === 'Bestseller' || index % 4 === 0,
    offerPrice: p.price,
    discountPercent: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
    createdAt: new Date(Date.now() - (35 - index) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Reads products from persistent storage or initial seed (Fallback)
 */
async function loadLocalProducts(): Promise<Product[]> {
  if (memoryCache && memoryCache.length > 0) {
    return memoryCache;
  }

  // Check primary local data directory
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return memoryCache;
      }
    }
  } catch (err) {
    console.warn('[DB] Could not read from primary DB file, checking fallback...', err);
  }

  // Check /tmp fallback (for serverless environments)
  try {
    if (fs.existsSync(TMP_DB_FILE_PATH)) {
      const data = fs.readFileSync(TMP_DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return memoryCache;
      }
    }
  } catch (err) {
    // Ignore fallback read failure
  }

  // Default to initial seed and persist it
  const seed = getInitialSeed();
  memoryCache = seed;
  await saveLocalProducts(seed);
  return seed;
}

/**
 * Persists products to local storage (Fallback)
 */
async function saveLocalProducts(products: Product[]): Promise<void> {
  memoryCache = products;
  const jsonContent = JSON.stringify(products, null, 2);

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, jsonContent, 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync(TMP_DB_FILE_PATH, jsonContent, 'utf-8');
    } catch (tmpErr) {
      console.warn('[DB] Persistent file write failed; memory cache will be used.', tmpErr);
    }
  }
}

/**
 * Get all products.
 * Queries Supabase when configured, with seamless auto-seeding on first run.
 * Falls back to local repository if Supabase credentials are not yet set.
 */
export async function getAllProducts(includeUnpublished = false): Promise<Product[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!includeUnpublished) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        if (data.length === 0) {
          // Auto-seed Supabase database on first connection
          console.log('[Supabase] Initializing empty database with 33 seed products...');
          const seed = getInitialSeed();
          const rows = seed.map(productToRow);
          const { error: seedErr } = await supabase.from('products').insert(rows);
          if (!seedErr) {
            console.log('[Supabase] Successfully seeded 33 products to cloud database.');
            return includeUnpublished ? seed : seed.filter((p) => p.published !== false);
          }
          console.error('[Supabase] Seed insertion error:', seedErr);
        } else {
          return data.map((row: DbProductRow) => rowToProduct(row));
        }
      } else if (error) {
        console.warn('[Supabase] Query error:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase] Connection error, using local fallback:', err);
    }
  }

  // Fallback to local file / memory
  const products = await loadLocalProducts();
  if (includeUnpublished) {
    return [...products];
  }
  return products.filter((p) => p.published !== false);
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string, includeUnpublished = false): Promise<Product | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('products').select('*').ilike('slug', slug);
      if (!includeUnpublished) {
        query = query.eq('published', true);
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return rowToProduct(data as DbProductRow);
      }
    } catch (err) {
      console.warn('[Supabase] Error getting product by slug:', err);
    }
  }

  const products = await getAllProducts(includeUnpublished);
  const found = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return rowToProduct(data as DbProductRow);
      }
    } catch (err) {
      console.warn('[Supabase] Error getting product by id:', err);
    }
  }

  const products = await loadLocalProducts();
  const found = products.find((p) => p.id === id);
  return found || null;
}

/**
 * Create a new product
 */
export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const id = `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const stock = typeof data.stockQuantity === 'number' ? data.stockQuantity : 10;
  const availability = stock > 0 ? 'in_stock' : 'out_of_stock';

  const newProduct: Product = {
    ...data,
    id,
    stockQuantity: stock,
    availability,
    published: data.published !== false,
    onOffer: !!data.onOffer,
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = productToRow(newProduct);
      const { error } = await supabase.from('products').insert(row);
      if (!error) {
        return newProduct;
      }
      console.error('[Supabase] Insert product error:', error.message);
    } catch (err) {
      console.error('[Supabase] Create exception:', err);
    }
  }

  // Local fallback
  const products = await loadLocalProducts();
  products.unshift(newProduct);
  await saveLocalProducts(products);
  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) {
    return null;
  }

  const updatedStock = updates.stockQuantity !== undefined ? updates.stockQuantity : existing.stockQuantity ?? 10;
  const updatedAvailability = updatedStock > 0 ? 'in_stock' : 'out_of_stock';

  const updated: Product = {
    ...existing,
    ...updates,
    id: existing.id,
    stockQuantity: updatedStock,
    availability: updatedAvailability,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = productToRow(updated);
      const { error } = await supabase.from('products').update(row).eq('id', id);
      if (!error) {
        return updated;
      }
      console.error('[Supabase] Update product error:', error.message);
    } catch (err) {
      console.error('[Supabase] Update exception:', err);
    }
  }

  // Local fallback
  const products = await loadLocalProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = updated;
    await saveLocalProducts(products);
  }
  return updated;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        return true;
      }
      console.error('[Supabase] Delete product error:', error.message);
    } catch (err) {
      console.error('[Supabase] Delete exception:', err);
    }
  }

  // Local fallback
  const products = await loadLocalProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  await saveLocalProducts(products);
  return true;
}

/**
 * Quick stock update helper
 */
export async function updateStock(id: string, newStock: number): Promise<Product | null> {
  const stockQuantity = Math.max(0, newStock);
  const availability = stockQuantity > 0 ? 'in_stock' : 'out_of_stock';

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          stock_quantity: stockQuantity,
          availability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return rowToProduct(data as DbProductRow);
      }
      if (error) {
        console.warn('[Supabase] Stock update warning:', error.message);
      }
    } catch (err) {
      console.error('[Supabase] Stock update exception:', err);
    }
  }

  return updateProduct(id, { stockQuantity, availability });
}

/**
 * Quick price and offer update helper
 */
export async function updatePriceAndOffer(
  id: string,
  options: {
    price: number;
    mrp: number;
    onOffer: boolean;
    offerPrice?: number;
  }
): Promise<Product | null> {
  const discountPercent = options.mrp > options.price 
    ? Math.round(((options.mrp - options.price) / options.mrp) * 100) 
    : 0;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          price: options.price,
          mrp: options.mrp,
          on_offer: options.onOffer,
          offer_price: options.offerPrice || options.price,
          discount_percent: discountPercent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return rowToProduct(data as DbProductRow);
      }
      if (error) {
        console.warn('[Supabase] Pricing update warning:', error.message);
      }
    } catch (err) {
      console.error('[Supabase] Pricing update exception:', err);
    }
  }

  return updateProduct(id, {
    price: options.price,
    mrp: options.mrp,
    onOffer: options.onOffer,
    offerPrice: options.offerPrice || options.price,
    discountPercent,
  });
}
