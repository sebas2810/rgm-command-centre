import type { AssortmentRecommendation, GrandTotalAssortment } from '../../types/pack'

// ── Grand Totals per Retailer (Danone reference p.41) ───────────────────────

export const assortmentTotals: GrandTotalAssortment[] = [
  {
    retailerId: 'carrefour',
    retailerFormat: 'Carrefour Hyper',
    actualTotal: 209,
    fairShareTotal: 241,
    totalListingOpps: 33,
    totalNewListings: 10,
  },
  {
    retailerId: 'carrefour',
    retailerFormat: 'Carrefour Super',
    actualTotal: 101,
    fairShareTotal: 93,
    totalListingOpps: -8,
    totalNewListings: 11,
  },
  {
    retailerId: 'ahorramas',
    retailerFormat: 'Ahorramas',
    actualTotal: 99,
    fairShareTotal: 90,
    totalListingOpps: -9,
    totalNewListings: 9,
  },
  {
    retailerId: 'mercadona',
    retailerFormat: 'Mercadona',
    actualTotal: 20,
    fairShareTotal: 30,
    totalListingOpps: 11,
    totalNewListings: 4,
  },
]

// ── Segment-Level Assortment Recommendations ────────────────────────────────

export const assortmentRecommendations: AssortmentRecommendation[] = [
  // ── Carrefour Hyper ──
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'greek',          actualSkuCount: 18, fairShareSkuCount: 28, listingOpps: 11, newListings: 2, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'essentials-kids', actualSkuCount: 22, fairShareSkuCount: 23, listingOpps: 1,  newListings: 0, action: 'maintain' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'cholesterol',     actualSkuCount: 10, fairShareSkuCount: 36, listingOpps: 26, newListings: 1, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'immunity',        actualSkuCount: 16, fairShareSkuCount: 32, listingOpps: 17, newListings: 0, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'plant-based',     actualSkuCount: 30, fairShareSkuCount: 39, listingOpps: 10, newListings: 1, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'bifidus',         actualSkuCount: 35, fairShareSkuCount: 30, listingOpps: -5, newListings: 0, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'protein',         actualSkuCount: 28, fairShareSkuCount: 19, listingOpps: -9, newListings: 2, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'kefir',           actualSkuCount: 15, fairShareSkuCount: 12, listingOpps: -3, newListings: 1, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'kids',            actualSkuCount: 18, fairShareSkuCount: 12, listingOpps: -6, newListings: 1, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Hyper', segmentId: 'light',           actualSkuCount: 17, fairShareSkuCount: 10, listingOpps: -7, newListings: 2, action: 'rationalize' },

  // ── Carrefour Super ──
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'greek',          actualSkuCount: 8,  fairShareSkuCount: 11, listingOpps: 3,  newListings: 2, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'essentials-kids', actualSkuCount: 18, fairShareSkuCount: 14, listingOpps: -4, newListings: 0, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'cholesterol',     actualSkuCount: 5,  fairShareSkuCount: 8,  listingOpps: 3,  newListings: 1, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'immunity',        actualSkuCount: 10, fairShareSkuCount: 12, listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'plant-based',     actualSkuCount: 12, fairShareSkuCount: 14, listingOpps: 2,  newListings: 2, action: 'expand' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'bifidus',         actualSkuCount: 18, fairShareSkuCount: 12, listingOpps: -6, newListings: 0, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'protein',         actualSkuCount: 14, fairShareSkuCount: 8,  listingOpps: -6, newListings: 2, action: 'rationalize' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'kefir',           actualSkuCount: 5,  fairShareSkuCount: 5,  listingOpps: 0,  newListings: 1, action: 'maintain' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'kids',            actualSkuCount: 6,  fairShareSkuCount: 5,  listingOpps: -1, newListings: 1, action: 'maintain' },
  { retailerId: 'carrefour', retailerFormat: 'Carrefour Super', segmentId: 'light',           actualSkuCount: 5,  fairShareSkuCount: 4,  listingOpps: -1, newListings: 1, action: 'rationalize' },

  // ── Ahorramas ──
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'greek',          actualSkuCount: 7,  fairShareSkuCount: 10, listingOpps: 3,  newListings: 2, action: 'expand' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'essentials-kids', actualSkuCount: 20, fairShareSkuCount: 15, listingOpps: -5, newListings: 0, action: 'rationalize' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'cholesterol',     actualSkuCount: 4,  fairShareSkuCount: 7,  listingOpps: 3,  newListings: 1, action: 'expand' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'immunity',        actualSkuCount: 9,  fairShareSkuCount: 11, listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'plant-based',     actualSkuCount: 10, fairShareSkuCount: 12, listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'bifidus',         actualSkuCount: 19, fairShareSkuCount: 13, listingOpps: -6, newListings: 0, action: 'rationalize' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'protein',         actualSkuCount: 13, fairShareSkuCount: 8,  listingOpps: -5, newListings: 2, action: 'rationalize' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'kefir',           actualSkuCount: 5,  fairShareSkuCount: 5,  listingOpps: 0,  newListings: 1, action: 'maintain' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'kids',            actualSkuCount: 7,  fairShareSkuCount: 5,  listingOpps: -2, newListings: 0, action: 'rationalize' },
  { retailerId: 'ahorramas', retailerFormat: 'Ahorramas', segmentId: 'light',           actualSkuCount: 5,  fairShareSkuCount: 4,  listingOpps: -1, newListings: 1, action: 'rationalize' },

  // ── Mercadona ──
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'greek',          actualSkuCount: 2,  fairShareSkuCount: 4,  listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'essentials-kids', actualSkuCount: 4,  fairShareSkuCount: 5,  listingOpps: 1,  newListings: 0, action: 'maintain' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'cholesterol',     actualSkuCount: 2,  fairShareSkuCount: 3,  listingOpps: 1,  newListings: 0, action: 'expand' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'immunity',        actualSkuCount: 3,  fairShareSkuCount: 5,  listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'plant-based',     actualSkuCount: 2,  fairShareSkuCount: 4,  listingOpps: 2,  newListings: 1, action: 'expand' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'bifidus',         actualSkuCount: 3,  fairShareSkuCount: 3,  listingOpps: 0,  newListings: 0, action: 'maintain' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'protein',         actualSkuCount: 2,  fairShareSkuCount: 2,  listingOpps: 0,  newListings: 1, action: 'maintain' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'kefir',           actualSkuCount: 1,  fairShareSkuCount: 2,  listingOpps: 1,  newListings: 0, action: 'expand' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'kids',            actualSkuCount: 1,  fairShareSkuCount: 1,  listingOpps: 0,  newListings: 0, action: 'maintain' },
  { retailerId: 'mercadona', retailerFormat: 'Mercadona', segmentId: 'light',           actualSkuCount: 0,  fairShareSkuCount: 1,  listingOpps: 1,  newListings: 0, action: 'expand' },
]
