# Bikerz Pitstop, Coimbatore 🏍️

Official Website & Product Catalogue with direct WhatsApp Ordering for **Bikerz Pitstop, Coimbatore**.

## Store Information
- **Business**: Bikerz Pitstop
- **Phone**: `93442 30478` (`+91 93442 30478`)
- **WhatsApp**: `+91 93442 30478` ([https://wa.me/919344230478](https://wa.me/919344230478))
- **Instagram**: [@bikerz_pitstop_coimbatore](https://www.instagram.com/bikerz_pitstop_coimbatore/)
- **Address**: 485, Nanjundapuram Rd, Keelakarai, Ramanathapuram, Coimbatore, Tamil Nadu 641045

---

## Architecture & Scope
Built strictly according to project specifications:
- **No Database / No Backend**: Local structured catalogue at `data/products.ts` and `data/bikes.ts`.
- **No Customer Accounts or Login/Signup**: Friction-free browsing and ordering.
- **Client-Side Cart**: Stored in browser `localStorage`, survives page reloads.
- **Direct WhatsApp Ordering**: Customer browses products → selects size/colour/bike → adds to cart → clicks **PROCEED TO WHATSAPP** → Bikerz Pitstop confirms availability, pricing, and payment directly on WhatsApp.
- **Bike Compatibility Engine**: Bike Brand → Bike Model filter ensures only verified fitting accessories (crash guards, bash plates, luggage racks) are shown.

---

## Pages Implemented
1. **Home (`/`)**: Hero with core CTAs, Shop by Category, Shop by Bike, Featured Products, New Arrivals, Popular Products, Instagram gallery, Visit Store & WhatsApp banner.
2. **Shop (`/shop`)**: Full catalog with functional search, category, brand, bike compatibility, price slider, stock availability, helmet size/color filters, and sorting. Includes mobile filter drawer.
3. **Helmets (`/helmets`)**: Dedicated helmets collection with subcategories (Full Face, Modular, Open Face, ADV, Visors) and head circumference sizing guide.
4. **Accessories (`/accessories`)**: Motorcycle crash guards, hand guards, bar-end mirrors, levers, chargers, mobile holders, and LED fog lights.
5. **Shop by Bike (`/shop-by-bike`)**: Bike Brand → Bike Model selector (e.g. Royal Enfield → Himalayan 450) showing only compatible parts.
6. **Product Details (`/product/[slug]`)**: High-res image gallery, specifications, bike fitment, size & colour selector, **Buy Now on WhatsApp**, **Add to Cart**, and **Ask About This Product**.
7. **Shopping Cart (`/cart`)**: Persistent cart with item quantities, price breakdown, and **PROCEED TO WHATSAPP** structured message generator.
8. **Help Center (`/help`)**: Topic-based direct WhatsApp inquiry launcher (Helmet sizing, Bike accessories, Stock availability, Custom requests).
9. **Contact (`/contact`)**: Ramanathapuram store address, timings, click-to-call, click-to-WhatsApp, Instagram, and clean **GET DIRECTIONS** button.

---

## Development & Deployment

### Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Vercel
This repository is 100% ready for instant deployment on Vercel:
1. Push code to GitHub/Git repository.
2. Import repository into Vercel.
3. Framework preset: **Next.js**.
4. Click **Deploy**.
