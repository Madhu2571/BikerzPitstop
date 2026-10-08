const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually for standalone node script execution
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = (match[2] || '').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[match[1]] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('========================================================');
console.log('  BIKERZ PITSTOP — SUPABASE DATABASE MIGRATION SCRIPT  ');
console.log('========================================================\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Notice: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local.');
  console.log('To run this migration against your Supabase project:');
  console.log('1. Create a free project at https://supabase.com');
  console.log('2. Execute the schema SQL in supabase/schema.sql in the Supabase SQL Editor');
  console.log('3. Add the following to your .env.local:');
  console.log('   SUPABASE_URL="https://your-project-ref.supabase.co"');
  console.log('   SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"');
  console.log('4. Re-run: npm run db:migrate\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Load products
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
const rawTs = fs.readFileSync(productsPath, 'utf8');

// Extraction regex
const productBlocks = rawTs.split(/id:\s*"/g).slice(1);
console.log(`Found ${productBlocks.length} products in data/products.ts to migrate.\n`);

const rows = [];
productBlocks.forEach((block, index) => {
  const id = (block.match(/^([^"]+)"/) || [])[1];
  const slug = (block.match(/slug:\s*"([^"]+)"/) || [])[1];
  const name = (block.match(/name:\s*"([^"]+)"/) || [])[1];
  const brand = (block.match(/brand:\s*"([^"]+)"/) || [])[1];
  const category = (block.match(/category:\s*"([^"]+)"/) || [])[1];
  const subCategory = (block.match(/subCategory:\s*"([^"]+)"/) || [])[1];
  const price = Number((block.match(/price:\s*(\d+)/) || [])[1] || 0);
  const mrp = Number((block.match(/mrp:\s*(\d+)/) || [])[1] || price);
  const availability = (block.match(/availability:\s*"([^"]+)"/) || [])[1] || 'in_stock';
  const badge = (block.match(/badge:\s*"([^"]+)"/) || [])[1] || null;
  const rating = Number((block.match(/rating:\s*([\d.]+)/) || [])[1] || 4.8);
  const reviewCount = Number((block.match(/reviewCount:\s*(\d+)/) || [])[1] || 0);

  // Images
  const imgMatches = block.match(/images:\s*\[([\s\S]*?)\]/);
  const images = imgMatches ? [...imgMatches[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : [];

  // Description
  const descMatch = block.match(/description:\s*"([^"]+)"/);
  const description = descMatch ? descMatch[1] : '';

  // Compatible bikes
  const bikeMatches = block.match(/compatibleBikes:\s*\[([\s\S]*?)\]/);
  const compatibleBikes = bikeMatches ? [...bikeMatches[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : ['Universal'];

  const stock = availability === 'out_of_stock' ? 0 : 10;
  const onOffer = badge === 'Bestseller' || index % 4 === 0;
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const now = new Date().toISOString();

  rows.push({
    id,
    slug,
    name,
    brand,
    category,
    sub_category: subCategory,
    price,
    mrp,
    images: JSON.stringify(images),
    description,
    specifications: JSON.stringify({}),
    compatible_bikes: JSON.stringify(compatibleBikes),
    availability,
    stock_quantity: stock,
    published: true,
    on_offer: onOffer,
    offer_price: price,
    discount_percent: discountPercent,
    featured: Boolean(block.includes('featured: true')),
    new_arrival: Boolean(block.includes('newArrival: true')),
    popular: Boolean(block.includes('popular: true')),
    badge,
    rating,
    review_count: reviewCount,
    created_at: now,
    updated_at: now,
  });
});

async function run() {
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  console.log(`Upserting ${rows.length} products into table "products"...`);

  const { data, error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Supabase Migration Error:', error.message);
    process.exit(1);
  }

  console.log(`✅ SUCCESS: Migrated and verified ${data.length} products in Supabase!`);
  console.log('Sample verified products:');
  data.slice(0, 3).forEach(p => {
    console.log(`  - [${p.id}] ${p.name} (Stock: ${p.stock_quantity}, Price: ₹${p.price})`);
  });
  console.log('\nAll products are now permanently stored in Supabase.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
