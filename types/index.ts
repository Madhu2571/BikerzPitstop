export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'pre_order';

export type ProductCategory = 
  | 'Helmets'
  | 'Motorcycle Accessories'
  | 'Lighting';

export type HelmetSubCategory = 
  | 'Full Face'
  | 'Open Face'
  | 'Modular'
  | 'Adventure/Off-road'
  | 'Helmet Accessories';

export type AccessorySubCategory = 
  | 'Crash Guards'
  | 'Hand Guards'
  | 'Mirrors'
  | 'Levers'
  | 'Bar Ends'
  | 'Footrests'
  | 'Mobile Holders'
  | 'USB Chargers'
  | 'Bike Covers'
  | 'Radiator Guards'
  | 'Tank Grips'
  | 'Emergency & Tools';

export type LightingSubCategory = 
  | 'Auxiliary Lights'
  | 'LED Lights'
  | 'Indicators'
  | 'Electrical Accessories';

export type ProductSubCategory = HelmetSubCategory | AccessorySubCategory | LightingSubCategory;

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  price: number;
  mrp: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  compatibleBikes: string[]; // Bike model names or 'Universal'
  sizes?: string[];
  colours?: string[];
  variants?: ProductVariant[];
  availability: AvailabilityStatus;
  stockQuantity?: number;
  published?: boolean;
  onOffer?: boolean;
  offerPrice?: number;
  discountPercent?: number;
  featured?: boolean;
  newArrival?: boolean;
  popular?: boolean;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BikeModel {
  name: string;
  year?: string;
}

export interface BikeBrand {
  brand: string;
  models: string[];
}

export interface CartItem {
  cartItemId: string; // generated unique id: `${productId}-${size || ''}-${colour || ''}-${bike || ''}`
  productId: string;
  product: Product;
  size?: string;
  colour?: string;
  selectedBike?: string;
  quantity: number;
  price: number;
}

export interface FilterState {
  category?: string;
  subCategory?: string;
  brand?: string;
  bike?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  size?: string;
  colour?: string;
  search?: string;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
}

export interface ProductRequestFormData {
  productName: string;
  brand?: string;
  bikeModel?: string;
  message?: string;
}
