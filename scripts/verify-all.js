const http = require('http');
const fs = require('fs');
const path = require('path');

function getCredentials() {
  let email = process.env.ADMIN_EMAIL || '';
  let password = process.env.ADMIN_PASSWORD || '';
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = (match[2] || '').trim().replace(/^["']|["']$/g, '');
          if (key === 'ADMIN_EMAIL' && !email) email = val;
          if (key === 'ADMIN_PASSWORD' && !password) password = val;
        }
      });
    }
  } catch (e) {}
  return { email, password };
}

function post(path, body, cookie = '') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(cookie ? { 'Cookie': cookie } : {}),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data ? JSON.parse(data) : {} }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function patch(path, body, cookie = '') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(cookie ? { 'Cookie': cookie } : {}),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function del(path, cookie = '') {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'DELETE',
      headers: cookie ? { 'Cookie': cookie } : {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} }));
    });
    req.on('error', reject);
    req.end();
  });
}

function get(path, cookie = '') {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: cookie ? { 'Cookie': cookie } : {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTestSuite() {
  console.log('--- RUNNING FULL 13-POINT TEST SUITE ---');

  // 1. Admin login
  const creds = getCredentials();
  const login = await post('/api/admin/login', {
    email: creds.email,
    password: creds.password,
  });
  console.log('1. Admin Login -> HTTP', login.status);
  const cookie = login.headers['set-cookie'] ? login.headers['set-cookie'][0].split(';')[0] : '';

  // 2. Add product
  const newProdRes = await post('/api/admin/products', {
    name: 'Test Persistent Auxiliary Mount Bracket',
    slug: 'test-aux-bracket-' + Date.now(),
    brand: 'Maddog',
    category: 'Lighting',
    subCategory: 'Electrical Accessories',
    price: 799,
    mrp: 999,
    description: 'Precision CNC auxiliary light mounting bracket for engine guard clamp.',
    specifications: { 'Material': 'T6 Billet Aluminum' },
    compatibleBikes: ['Universal'],
    stockQuantity: 15,
    published: true,
  }, cookie);
  console.log('2. Add Product -> HTTP', newProdRes.status, '| ID:', newProdRes.body.product?.id);
  const createdId = newProdRes.body.product?.id;

  if (createdId) {
    // 3. Edit product
    const editRes = await patch(`/api/admin/products/${createdId}/pricing`, {
      price: 699,
      mrp: 999,
      onOffer: true,
      offerPrice: 699,
    }, cookie);
    console.log('3. Edit Pricing/Offer -> HTTP', editRes.status, '| New Price: ₹' + editRes.body.product?.price);

    // 4. Change stock (e.g. 15 -> 7)
    const stockRes = await patch(`/api/admin/products/${createdId}/stock`, {
      stockQuantity: 7,
    }, cookie);
    console.log('4. Change Stock (15 -> 7) -> HTTP', stockRes.status, '| Stock:', stockRes.body.product?.stockQuantity);

    // 5. Hide / Show Product
    const hideRes = await patch(`/api/admin/products/${createdId}/visibility`, {
      published: false,
    }, cookie);
    console.log('5. Hide Product -> HTTP', hideRes.status, '| Published:', hideRes.body.product?.published);

    const showRes = await patch(`/api/admin/products/${createdId}/visibility`, {
      published: true,
    }, cookie);
    console.log('6. Show Product -> HTTP', showRes.status, '| Published:', showRes.body.product?.published);

    // 7. Delete Product
    const delRes = await del(`/api/admin/products/${createdId}`, cookie);
    console.log('7. Delete Product -> HTTP', delRes.status, '| Success:', delRes.body.success);
  }

  // 8. Customer Storefront
  const home = await get('/');
  console.log('8. Customer Storefront -> HTTP', home.status);

  // 9. Customer Products API
  const prods = await get('/api/products');
  const prodsJson = JSON.parse(prods.body);
  console.log('9. Customer Products API -> HTTP', prods.status, '| Total Available Products:', prodsJson.products?.length);

  // 10. Customer Product Page
  const pPage = await get('/product/axor-apex-venomous-helmet');
  console.log('10. Customer Product Page -> HTTP', pPage.status);

  // 11. Customer Fit My Bike
  const fit = await get('/fit-my-bike');
  console.log('11. Customer Fit My Bike -> HTTP', fit.status);

  // 12. Customer Build My Bike
  const bmb = await get('/build-my-bike');
  console.log('12. Customer Build My Bike -> HTTP', bmb.status);

  // 13. Customer Emergency Kit
  const emer = await get('/emergency-kit');
  console.log('13. Customer Emergency Kit -> HTTP', emer.status);
}

runTestSuite().catch(console.error);
