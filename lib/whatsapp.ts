import { BUSINESS_CONFIG } from '@/data/business';
import { CartItem, Product } from '@/types';

/**
 * Formats Indian Rupee currency with commas
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds standard WhatsApp URL with encoded message
 */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message.trim());
  return `${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encoded}`;
}

/**
 * General Enquiry message
 */
export function getGeneralWhatsAppUrl(): string {
  const message = `Hi Bikerz Pitstop 👋
I have a general enquiry about motorcycle accessories and helmets available at your Coimbatore store. Could you please assist me?
Thank you!`;
  return buildWhatsAppUrl(message);
}

/**
 * Buy Now WhatsApp message for a single product with selected options
 */
export interface BuyNowParams {
  product: Product;
  size?: string;
  colour?: string;
  selectedBike?: string;
  quantity: number;
}

export function getBuyNowWhatsAppUrl(params: BuyNowParams): string {
  const { product, size, colour, selectedBike, quantity } = params;
  const totalPrice = product.price * quantity;

  const lines: string[] = [
    `Hi Bikerz Pitstop 👋`,
    `I'm interested in:`,
    `Product: ${product.name}`,
    `Brand: ${product.brand}`,
  ];

  if (size) lines.push(`Size: ${size}`);
  if (colour) lines.push(`Colour: ${colour}`);
  if (selectedBike) lines.push(`Bike: ${selectedBike}`);

  lines.push(`Quantity: ${quantity}`);
  lines.push(`Price shown: ${formatPrice(product.price)} (Total: ${formatPrice(totalPrice)})`);
  lines.push(``);
  lines.push(`Please confirm availability and final price.`);
  lines.push(`Thank you.`);

  return buildWhatsAppUrl(lines.join('\n'));
}

/**
 * Cart WhatsApp message containing every cart item
 */
export function getCartWhatsAppUrl(cartItems: CartItem[]): string {
  if (cartItems.length === 0) {
    return getGeneralWhatsAppUrl();
  }

  const lines: string[] = [
    `Hi Bikerz Pitstop 👋`,
    `I'd like to enquire/order about:`,
    ``,
  ];

  let calculatedTotal = 0;

  cartItems.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.product.name}`);
    if (item.size) lines.push(`   Size: ${item.size}`);
    if (item.colour) lines.push(`   Colour: ${item.colour}`);
    if (item.selectedBike) lines.push(`   Bike: ${item.selectedBike}`);
    lines.push(`   Qty: ${item.quantity}`);
    lines.push(`   Price shown: ${formatPrice(item.price)} each`);
    lines.push(``);

    calculatedTotal += item.price * item.quantity;
  });

  lines.push(`Estimated total: ${formatPrice(calculatedTotal)}`);
  lines.push(``);
  lines.push(`Please confirm availability and final pricing.`);
  lines.push(`Thank you.`);

  return buildWhatsAppUrl(lines.join('\n'));
}

/**
 * Out-of-Stock enquiry WhatsApp message
 */
export function getOutOfStockWhatsAppUrl(
  product: Product,
  options?: { size?: string; colour?: string; selectedBike?: string }
): string {
  const lines: string[] = [
    `Hi Bikerz Pitstop 👋`,
    `I'm interested in the out-of-stock item:`,
    `Product: ${product.name}`,
    `Brand: ${product.brand}`,
  ];

  if (options?.size) lines.push(`Size: ${options.size}`);
  if (options?.colour) lines.push(`Colour: ${options.colour}`);
  if (options?.selectedBike) lines.push(`Bike: ${options.selectedBike}`);

  lines.push(`Price: ${formatPrice(product.price)}`);
  lines.push(``);
  lines.push(`Could you please let me know when this will be back in stock or if I can pre-order it?`);
  lines.push(`Thank you.`);

  return buildWhatsAppUrl(lines.join('\n'));
}

/**
 * Request A Product WhatsApp message
 */
export interface ProductRequestParams {
  productName: string;
  brand?: string;
  bikeModel?: string;
  message?: string;
}

export function getProductRequestWhatsAppUrl(params: ProductRequestParams): string {
  const lines: string[] = [
    `Hi Bikerz Pitstop 👋`,
    `I'm looking for a product that isn't listed on your catalogue:`,
    `Product: ${params.productName}`,
  ];

  if (params.brand) lines.push(`Brand: ${params.brand}`);
  if (params.bikeModel) lines.push(`Bike / Model: ${params.bikeModel}`);
  if (params.message) lines.push(`Details / Note: ${params.message}`);

  lines.push(``);
  lines.push(`Could you please check if this is available in store or can be sourced?`);
  lines.push(`Thank you.`);

  return buildWhatsAppUrl(lines.join('\n'));
}

/**
 * Help topic WhatsApp message
 */
export function getHelpWhatsAppUrl(topic: string, details?: string): string {
  const lines: string[] = [
    `Hi Bikerz Pitstop 👋`,
    `I need assistance regarding: ${topic}`,
  ];

  if (details) {
    lines.push(`Details: ${details}`);
  }

  lines.push(``);
  lines.push(`Could you please assist me?`);
  lines.push(`Thank you.`);

  return buildWhatsAppUrl(lines.join('\n'));
}
