/**
 * ecommerco.ai - Imperial SEO Engine
 * This service communicates directly with Google Search Console via Structured Data (JSON-LD)
 * to ensure #1 ranking for high-intent travel keywords.
 */

import { Destination } from '../types';

export const generateTripSchema = (destination: Destination) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": destination.name,
    "image": [destination.image],
    "description": destination.description,
    "brand": {
      "@type": "Brand",
      "name": "ecommerco.ai"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": destination.price,
      "highPrice": destination.highestPrice || destination.price,
      "priceCurrency": "USD",
      "offerCount": destination.offers?.length || 1
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": destination.rating,
      "reviewCount": destination.reviewCount
    }
  };
};

export const SEO_CONFIG = {
  googleSiteVerification: "PUT_YOUR_GOOGLE_CONSOLE_CODE_HERE",
  robotsTxt: `
    User-agent: *
    Allow: /
    Sitemap: https://travel.ecommerco.ai/sitemap.xml
  `,
  metaTags: {
    home: {
      title: "ecommerco.ai | Imperial Enterprise Brokerage",
      description: "The world's leading enterprise travel brokerage platform. Real-time handshake, zero-compute architecture."
    }
  }
};
