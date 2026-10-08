import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products-store';
import { ALL_BIKE_MODELS, POPULAR_BIKE_BRANDS } from '@/data/bikes';
import { Product } from '@/types';
import { 
  formatPrice, 
  getAskBikerzEscalationWhatsAppUrl, 
  getBuyNowWhatsAppUrl, 
  getOutOfStockWhatsAppUrl 
} from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query: string = (body.query || '').trim();
    const currentBike: string = (body.currentBike || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Load actual live products
    const allProducts = await getAllProducts(false); // published only

    // Run our deterministic, non-hallucinating AI reasoning engine
    const response = processQuery(query, allProducts, currentBike);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    console.error('Ask Bikerz AI error:', error);
    return NextResponse.json(
      {
        success: false,
        answer: 'Sorry, I encountered an issue accessing the catalogue. Please feel free to connect with our Coimbatore shop team directly on WhatsApp!',
        recommendedProducts: [],
      },
      { status: 500 }
    );
  }
}

/**
 * Natural Language Processing Engine for Bikerz Pitstop Catalogue
 */
function processQuery(
  rawQuery: string,
  products: Product[],
  explicitBike?: string
): {
  answer: string;
  recommendedProducts: Product[];
  escalationUrl: string;
  suggestedQueries: string[];
} {
  // Clean commas from numbers in query (e.g. "2,000" -> "2000", "1,500" -> "1500")
  const query = rawQuery.toLowerCase().replace(/(\d+),(\d+)/g, '$1$2');

  // 1. Extract Budget
  let budget: number | null = null;
  // First priority: explicit budget phrases like "budget is 1500", "budget 2000", "under 1000", "have 2000"
  const explicitBudgetMatch = query.match(/(?:budget(?:\s*is)?|under|below|within|upto|up to|max|around|have)\s*(?:of\s*)?(?:₹|rs\.?)?\s*(\d{3,6})/i);
  if (explicitBudgetMatch && explicitBudgetMatch[1]) {
    budget = parseInt(explicitBudgetMatch[1], 10);
  } else {
    // Second priority: currency symbol followed by number (e.g. "₹2000", "rs 1500")
    const currencyMatch = query.match(/(?:₹|rs\.?)\s*(\d{3,6})/i);
    if (currencyMatch && currencyMatch[1]) {
      budget = parseInt(currencyMatch[1], 10);
    } else {
      // Third priority: number followed by rupees/inr (e.g. "2000 rupees")
      const suffixMatch = query.match(/(\d{3,6})\s*(?:rs|rupees|inr)/i);
      if (suffixMatch && suffixMatch[1]) {
        budget = parseInt(suffixMatch[1], 10);
      }
    }
  }

  // 2. Extract Bike
  let detectedBike: string = explicitBike || '';
  if (!detectedBike) {
    for (const b of POPULAR_BIKE_BRANDS) {
      if (query.includes(b.brand.toLowerCase())) {
        detectedBike = b.brand;
        for (const m of b.models) {
          if (query.includes(m.toLowerCase()) || query.includes(m.toLowerCase().replace(/[\s\-_()]/g, ''))) {
            detectedBike = m;
            break;
          }
        }
        break;
      }
    }

    // Check specific popular models if brand was omitted (e.g. "MT-15", "Duke 390", "Himalayan", "R15", "Hunter")
    if (!detectedBike) {
      const keywords = [
        { key: 'mt-15', name: 'MT-15 V2' },
        { key: 'mt15', name: 'MT-15 V2' },
        { key: 'r15', name: 'YZF R15 V4' },
        { key: 'duke 390', name: '390 Duke (Gen 3)' },
        { key: 'duke 200', name: '200 Duke' },
        { key: 'duke', name: '390 Duke (Gen 3)' },
        { key: 'himalayan 450', name: 'Himalayan 450' },
        { key: 'himalayan', name: 'Himalayan 450' },
        { key: 'hunter 350', name: 'Hunter 350' },
        { key: 'hunter', name: 'Hunter 350' },
        { key: 'classic 350', name: 'Classic 350 (Reborn)' },
        { key: 'classic', name: 'Classic 350 (Reborn)' },
        { key: 'speed 400', name: 'Speed 400' },
        { key: 'scrambler 400', name: 'Scrambler 400X' },
        { key: 'interceptor', name: 'Interceptor 650' },
        { key: 'gt 650', name: 'Continental GT 650' },
        { key: 'aerox', name: 'Aerox 155' },
        { key: 'ronin', name: 'Ronin 225' },
      ];
      for (const item of keywords) {
        if (query.includes(item.key)) {
          detectedBike = item.name;
          break;
        }
      }

      // Check if user asked about fitment for a model not in our top keywords (e.g. "fit Ducati Panigale")
      if (!detectedBike) {
        const fitPattern = query.match(/(?:fit|fits|compatible with|for my|for)\s+([a-z0-9\s\-]+?)(?:\?|$|\.|\,)/i);
        if (fitPattern && fitPattern[1]) {
          const potentialBike = fitPattern[1].trim();
          const ignored = ['me', 'touring', 'commute', 'college', 'daily', 'highway', 'night', 'rain', 'all', 'safety', 'long ride'];
          if (!ignored.includes(potentialBike.toLowerCase()) && potentialBike.length > 2) {
            detectedBike = potentialBike;
          }
        }
      }
    }
  }

  // 3. Extract Category / Intent
  const isTouring = query.includes('tour') || query.includes('highway') || query.includes('long ride') || query.includes('trip');
  const isCommute = query.includes('commute') || query.includes('college') || query.includes('office') || query.includes('daily') || query.includes('city');
  const isPhoneHolder = query.includes('phone') || query.includes('mobile') || query.includes('mount') || query.includes('holder');
  const isHelmet = query.includes('helmet') || query.includes('visor') || query.includes('pinlock');
  const isLight = query.includes('light') || query.includes('fog') || query.includes('aux') || query.includes('headlight') || query.includes('indicator');
  const isCrashGuard = query.includes('crash') || query.includes('guard') || query.includes('slider') || query.includes('protection');
  const isEmergency = query.includes('emergency') || query.includes('puncture') || query.includes('inflator') || query.includes('tool') || query.includes('kit');
  const isComparison = query.includes('compare') || query.includes('better') || query.includes('which one') || query.includes('vs') || query.includes('difference');
  const isReviewQuery = query.includes('review') || query.includes('rating') || query.includes('think about') || query.includes('opinion');

  // WhatsApp Escalation URL with context
  const escalationUrl = getAskBikerzEscalationWhatsAppUrl({
    bike: detectedBike || undefined,
    budget: budget ? `₹${budget}` : undefined,
    question: rawQuery,
  });

  // ========================================================
  // SCENARIO A: REVIEW / RATING INQUIRY
  // ========================================================
  if (isReviewQuery) {
    const matched = products.find((p) => 
      query.includes(p.name.toLowerCase()) || 
      query.includes(p.brand.toLowerCase()) ||
      p.name.toLowerCase().split(' ').some((word) => word.length > 3 && query.includes(word))
    );

    if (matched) {
      if (matched.rating && matched.reviewCount && matched.reviewCount > 0) {
        return {
          answer: `Here is the genuine feedback on the **${matched.name}**:\n\n` +
            `⭐ **Rating:** ${matched.rating} / 5.0 (based on ${matched.reviewCount} customer reviews at Bikerz Pitstop).\n\n` +
            `Key highlights reported by riders: ${matched.description}\n\n` +
            `*Price:* ${formatPrice(matched.price)}${matched.mrp > matched.price ? ` (MRP ${formatPrice(matched.mrp)})` : ''}\n` +
            `*Stock:* ${matched.availability === 'in_stock' ? 'In stock in Coimbatore' : 'Currently Out of Stock'}`,
          recommendedProducts: [matched],
          escalationUrl,
          suggestedQueries: [
            `Compare ${matched.name} with alternatives`,
            `Will this fit my bike?`,
            `Ask about availability on WhatsApp`,
          ],
        };
      } else {
        return {
          answer: `For **${matched.name}**, there aren't enough customer reviews yet.\n\n` +
            `However, here are the verified factory specifications:\n` +
            `- Brand: ${matched.brand}\n` +
            `- Price: ${formatPrice(matched.price)}\n` +
            `- Category: ${matched.subCategory}\n` +
            `- Stock status: ${matched.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}\n\n` +
            `Would you like to ask our workshop mechanics in Ramanathapuram about customer feedback?`,
          recommendedProducts: [matched],
          escalationUrl,
          suggestedQueries: [
            `What accessories fit my bike?`,
            `Show me top rated helmets`,
          ],
        };
      }
    }
  }

  // ========================================================
  // SCENARIO B: PRODUCT COMPARISON (e.g. BOBO vs Motowolf)
  // ========================================================
  if (isComparison) {
    // Find products mentioned or relevant
    let matchingCandidates: Product[] = [];
    if (isPhoneHolder) {
      matchingCandidates = products.filter((p) => p.subCategory === 'Mobile Holders');
    } else if (isHelmet) {
      matchingCandidates = products.filter((p) => p.category === 'Helmets' && p.subCategory === 'Full Face');
    } else if (isLight) {
      matchingCandidates = products.filter((p) => p.subCategory === 'Auxiliary Lights');
    } else {
      matchingCandidates = products.filter((p) => 
        query.includes(p.brand.toLowerCase()) || 
        query.includes(p.name.toLowerCase().split(' ')[0].toLowerCase())
      );
    }

    if (matchingCandidates.length >= 2) {
      const [itemA, itemB] = matchingCandidates.slice(0, 2);
      const diffText = `Here is a factual comparison between **${itemA.name}** and **${itemB.name}** based on verified store specifications:\n\n` +
        `| Feature | ${itemA.brand} (${itemA.name.slice(0, 20)}...) | ${itemB.brand} (${itemB.name.slice(0, 20)}...) |\n` +
        `|---|---|---|\n` +
        `| **Price** | **${formatPrice(itemA.price)}** | **${formatPrice(itemB.price)}** |\n` +
        `| **MRP** | ${formatPrice(itemA.mrp)} | ${formatPrice(itemB.mrp)} |\n` +
        `| **Stock** | ${itemA.availability === 'in_stock' ? '✅ In Stock' : '❌ Out of Stock'} | ${itemB.availability === 'in_stock' ? '✅ In Stock' : '❌ Out of Stock'} |\n` +
        `| **Rating** | ${itemA.rating ? `⭐ ${itemA.rating}/5 (${itemA.reviewCount || 0} reviews)` : 'No reviews yet'} | ${itemB.rating ? `⭐ ${itemB.rating}/5 (${itemB.reviewCount || 0} reviews)` : 'No reviews yet'} |\n\n` +
        `**Key Differences:**\n` +
        `- **${itemA.name}**: ${itemA.description}\n` +
        `- **${itemB.name}**: ${itemB.description}\n\n` +
        `*Neither product has fabricated claims. Both can be test-fitted in our Coimbatore store.*`;

      return {
        answer: diffText,
        recommendedProducts: [itemA, itemB],
        escalationUrl,
        suggestedQueries: [
          `Add ${itemA.brand} to cart`,
          `Add ${itemB.brand} to cart`,
          `Will either fit my bike?`,
        ],
      };
    }
  }

  // ========================================================
  // SCENARIO C: BIKE COMPATIBILITY QUERY (e.g. "I have an MT-15. What fits?")
  // ========================================================
  if (detectedBike && !budget && !isCommute && !isTouring) {
    const cleanBike = detectedBike.replace(/^(?:a|an|the|my)\s+/i, '').trim();
    const norm = cleanBike.toLowerCase().replace(/[\s\-_()]/g, '');
    let compatibleList = products.filter((p) => {
      const bikes = p.compatibleBikes || [];
      const isUniversal = bikes.some((b) => b.toLowerCase() === 'universal');
      const isExact = bikes.some((b) => {
        const nb = b.toLowerCase().replace(/[\s\-_()]/g, '');
        return nb === norm || norm.includes(nb) || nb.includes(norm);
      });
      return isExact || (isUniversal && p.category !== 'Helmets');
    });

    // If specific item type was asked (e.g. crash guard, phone holder, lights, etc.)
    if (isCrashGuard) {
      compatibleList = compatibleList.filter((p) => p.subCategory === 'Crash Guards' || p.subCategory === 'Radiator Guards');
    } else if (isPhoneHolder) {
      compatibleList = compatibleList.filter((p) => p.subCategory === 'Mobile Holders');
    } else if (isLight) {
      compatibleList = compatibleList.filter((p) => p.category === 'Lighting');
    } else if (isHelmet) {
      compatibleList = products.filter((p) => p.category === 'Helmets');
    }

    if (compatibleList.length > 0) {
      // Pick top recommended compatible items
      const selected = compatibleList.slice(0, 5);
      const namesList = selected.map((p) => `- **${p.name}** (${formatPrice(p.price)}) - *${p.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}*`).join('\n');

      return {
        answer: `Here are verified accessories from our catalogue compatible with your **${cleanBike}**:\n\n${namesList}\n\n` +
          `All items listed match your bike's mounting specs or universal motorcycle fitment. If you are uncertain about physical clearance or wiring, click below to chat with our workshop technicians.`,
        recommendedProducts: selected,
        escalationUrl,
        suggestedQueries: [
          `Accessories under ₹2,000 for ${cleanBike}`,
          `Touring setup for ${cleanBike}`,
          `Daily commute essentials for ${cleanBike}`,
        ],
      };
    } else {
      return {
        answer: `I'm not confident about the compatibility for **${cleanBike}** based on the available information.\n\n` +
          `We do not guess compatibility to protect your bike. Please ask Bikerz Pitstop directly on WhatsApp with your exact model and year so our workshop mechanics can check warehouse stock or custom fabrications.`,
        recommendedProducts: [],
        escalationUrl,
        suggestedQueries: [
          `Ask Bikerz Pitstop on WhatsApp`,
          `Browse all universal accessories`,
        ],
      };
    }
  }

  // ========================================================
  // SCENARIO D: COMBINED INTENT (Bike + Use Case + Budget)
  // e.g. "I have a Duke 200, I ride to college every day, budget ₹1,500"
  // ========================================================
  let candidateProducts = [...products];

  // Filter by bike if known
  if (detectedBike) {
    const norm = detectedBike.toLowerCase().replace(/[\s\-_()]/g, '');
    candidateProducts = candidateProducts.filter((p) => {
      const bikes = p.compatibleBikes || [];
      const isUniversal = bikes.some((b) => b.toLowerCase() === 'universal');
      const isExact = bikes.some((b) => {
        const nb = b.toLowerCase().replace(/[\s\-_()]/g, '');
        return nb === norm || norm.includes(nb) || nb.includes(norm);
      });
      return isExact || isUniversal;
    });
  }

  // Filter by budget if known
  if (budget) {
    candidateProducts = candidateProducts.filter((p) => p.price <= budget);
  }

  // Filter/Sort by use-case if known
  if (isCommute) {
    // Commuting priority: mobile mounts, usb chargers, bike covers, rain/anti-fog, levers
    const commuteSubs = ['Mobile Holders', 'USB Chargers', 'Bike Covers', 'Helmet Accessories', 'Levers', 'Bar Ends'];
    candidateProducts.sort((a, b) => {
      const aCommute = commuteSubs.includes(a.subCategory) ? 1 : 0;
      const bCommute = commuteSubs.includes(b.subCategory) ? 1 : 0;
      return bCommute - aCommute;
    });
  } else if (isTouring) {
    // Touring priority: crash guards, aux lights, footpegs, chargers, puncture kit, inflator
    const tourSubs = ['Crash Guards', 'Auxiliary Lights', 'Footrests', 'USB Chargers', 'Emergency & Tools', 'Hand Guards'];
    candidateProducts.sort((a, b) => {
      const aTour = tourSubs.includes(a.subCategory) ? 1 : 0;
      const bTour = tourSubs.includes(b.subCategory) ? 1 : 0;
      return bTour - aTour;
    });
  } else if (isEmergency) {
    candidateProducts = candidateProducts.filter((p) => p.subCategory === 'Emergency & Tools' || p.subCategory === 'USB Chargers' || p.subCategory === 'Bike Covers');
  } else if (isPhoneHolder) {
    candidateProducts = candidateProducts.filter((p) => p.subCategory === 'Mobile Holders');
  } else if (isHelmet) {
    candidateProducts = candidateProducts.filter((p) => p.category === 'Helmets');
  } else if (isLight) {
    candidateProducts = candidateProducts.filter((p) => p.category === 'Lighting');
  } else if (isCrashGuard) {
    candidateProducts = candidateProducts.filter((p) => p.subCategory === 'Crash Guards' || p.subCategory === 'Radiator Guards');
  }

  // Prioritize in-stock items
  candidateProducts.sort((a, b) => {
    const aStock = a.availability === 'in_stock' ? 1 : 0;
    const bStock = b.availability === 'in_stock' ? 1 : 0;
    return bStock - aStock;
  });

  const finalRecommendations = candidateProducts.slice(0, 4);

  if (finalRecommendations.length > 0) {
    let answerIntro = 'Based on our current live Coimbatore catalogue, here are suitable options:';
    if (detectedBike && budget && isCommute) {
      answerIntro = `Understood! You ride a **${detectedBike}**, use it for **daily commuting**, and have a budget of **${formatPrice(budget)}**.\nHere are verified products that match your requirements:`;
    } else if (budget && detectedBike) {
      answerIntro = `Here are verified accessories for your **${detectedBike}** under **${formatPrice(budget)}**:`;
    } else if (budget) {
      answerIntro = `Here are our best in-stock motorcycle accessories within your **${formatPrice(budget)}** budget:`;
    } else if (isTouring) {
      answerIntro = `Here are essential highway touring accessories currently available in store:`;
    } else if (isCommute) {
      answerIntro = `Here are everyday commuter essentials to make your daily ride practical and reliable:`;
    }

    const itemsSummary = finalRecommendations.map((p) => {
      const stockBadge = p.availability === 'in_stock' ? '✅ In Stock' : '⚠️ Out of Stock (Request via WhatsApp)';
      return `- **${p.name}** — ${formatPrice(p.price)} (${stockBadge})\n  *${p.description.slice(0, 95)}...*`;
    }).join('\n\n');

    return {
      answer: `${answerIntro}\n\n${itemsSummary}\n\n*All prices and stock levels reflect real-time store availability.*`,
      recommendedProducts: finalRecommendations,
      escalationUrl,
      suggestedQueries: [
        budget ? `What fits under ₹${Math.round(budget * 1.5)}?` : `Show accessories under ₹2,000`,
        detectedBike ? `Will these fit my ${detectedBike}?` : `Check compatibility for my bike`,
        `Ask Bikerz Pitstop on WhatsApp`,
      ],
    };
  }

  // Default fallback if no products match strict filters
  return {
    answer: `I could not find exact products matching all your filters in our current catalogue.\n\n` +
      `We carry many custom brackets and unlisted items at our Ramanathapuram, Coimbatore showroom. Would you like to check with our store staff directly on WhatsApp?`,
    recommendedProducts: products.filter((p) => p.featured || p.popular).slice(0, 3),
    escalationUrl,
    suggestedQueries: [
      `Show products under ₹2,000`,
      `Show full face helmets`,
      `Emergency kit for highway rides`,
    ],
  };
}
