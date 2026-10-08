import fs from 'fs';
import path from 'path';
import { Product } from '@/types';
import { PRODUCTS as INITIAL_SEED_PRODUCTS } from '@/data/products';

// Primary and fallback storage file paths
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'products-db.json');
const TMP_DB_FILE_PATH = path.join('/tmp', 'bikerz-products-db.json');

// In-memory cache for fast read/write
let memoryCache: Product[] | null = null;

/**
 * Returns seed products with initialized admin fields
 */
function getInitialSeed(): Product[] {
  return INITIAL_SEED_PRODUCTS.map((p, index) => ({
    ...p,
    stockQuantity: p.availability === 'out_of_stock' ? 0 : 10,
    published: true,
    onOffer: p.badge === 'Bestseller' || index % 4 === 0,
    offerPrice: p.price,
    discountPercent: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
    createdAt: new Date(Date.now() - (30 - index) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Reads products from persistent storage or initial seed
 */
async function loadProducts(): Promise<Product[]> {
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
  await saveProducts(seed);
  return seed;
}

/**
 * Persists products to storage
 */
async function saveProducts(products: Product[]): Promise<void> {
  memoryCache = products;
  const jsonContent = JSON.stringify(products, null, 2);

  // Attempt writing to primary data path
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, jsonContent, 'utf-8');
  } catch (err) {
    // Attempt writing to /tmp for read-only serverless lambdas
    try {
      fs.writeFileSync(TMP_DB_FILE_PATH, jsonContent, 'utf-8');
    } catch (tmpErr) {
      console.warn('[DB] Persistent file write failed; memory cache will be used.', tmpErr);
    }
  }
}

/**
 * Get all products.
 * If includeUnpublished is false (default for customer website), only published products are returned.
 */
export async function getAllProducts(includeUnpublished = false): Promise<Product[]> {
  const products = await loadProducts();
  if (includeUnpublished) {
    return [...products];
  }
  // Customer facing: only published products
  return products.filter((p) => p.published !== false);
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string, includeUnpublished = false): Promise<Product | null> {
  const products = await getAllProducts(includeUnpublished);
  const found = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProducts();
  const found = products.find((p) => p.id === id);
  return found || null;
}

/**
 * Create a new product
 */
export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const products = await loadProducts();

  const id = `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Stock and availability synchronization
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

  products.unshift(newProduct);
  await saveProducts(products);
  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await loadProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  const existing = products[index];
  const updatedStock = updates.stockQuantity !== undefined ? updates.stockQuantity : existing.stockQuantity ?? 10;
  const updatedAvailability = updatedStock > 0 ? 'in_stock' : 'out_of_stock';

  const updated: Product = {
    ...existing,
    ...updates,
    id: existing.id, // ID cannot be changed
    stockQuantity: updatedStock,
    availability: updatedAvailability,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await saveProducts(products);
  return updated;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await loadProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  await saveProducts(products);
  return true;
}

/**
 * Quick stock update helper
 */
export async function updateStock(id: string, newStock: number): Promise<Product | null> {
  const stockQuantity = Math.max(0, newStock);
  const availability = stockQuantity > 0 ? 'in_stock' : 'out_of_stock';
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

  return updateProduct(id, {
    price: options.price,
    mrp: options.mrp,
    onOffer: options.onOffer,
    offerPrice: options.offerPrice || options.price,
    discountPercent,
  });
}
