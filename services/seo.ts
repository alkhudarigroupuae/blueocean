/**
 * Alkhudari Group - Imperial SEO Engine
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
      "name": "Alkhudari Group"
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
    Sitemap: https://travel.alkhudarigroup.com/sitemap.xml
  `,
  metaTags: {
    home: {
      title: "Alkhudari Group | Imperial Travel & Booking Hub",
      description: "Book exclusive flights and packages via travel.alkhudarigroup.com. The leading travel brokerage platform."
    }
  }
};
