import type { SKUShareValue } from '../../types/pack'

// ── SKU Share vs Value Share Grid (Danone reference pp.38/40) ───────────────
// ratio = (SKU share / value share) × 100
// >100 = over-SKU'd (too many SKUs for the value delivered)
// <100 = under-represented (opportunity to add SKUs)

export const skuShareValue: SKUShareValue[] = [
  // ── Protein ── over-SKU'd across most channels (150-187%)
  { segmentId: 'protein', channelOrRetailer: 'Discounters',      skuSharePct: 9.2, valueSharePct: 5.1, ratio: 180, projected3Y: 160 },
  { segmentId: 'protein', channelOrRetailer: 'Regional Supers',  skuSharePct: 8.8, valueSharePct: 5.5, ratio: 160, projected3Y: 145 },
  { segmentId: 'protein', channelOrRetailer: 'National Supers',  skuSharePct: 9.5, valueSharePct: 5.1, ratio: 187, projected3Y: 165 },
  { segmentId: 'protein', channelOrRetailer: 'Hypers',           skuSharePct: 8.4, valueSharePct: 5.3, ratio: 158, projected3Y: 140 },
  { segmentId: 'protein', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 9.0, valueSharePct: 5.2, ratio: 173, projected3Y: 155 },
  { segmentId: 'protein', channelOrRetailer: 'Carrefour Super',  skuSharePct: 8.5, valueSharePct: 5.4, ratio: 157, projected3Y: 142 },
  { segmentId: 'protein', channelOrRetailer: 'Ahorramas',        skuSharePct: 8.0, valueSharePct: 5.3, ratio: 151, projected3Y: 138 },
  { segmentId: 'protein', channelOrRetailer: 'Mercadona',        skuSharePct: 7.5, valueSharePct: 5.0, ratio: 150, projected3Y: 135 },

  // ── Kids ── over-SKU'd (120-160%)
  { segmentId: 'kids', channelOrRetailer: 'Discounters',      skuSharePct: 5.6, valueSharePct: 3.5, ratio: 160, projected3Y: 145 },
  { segmentId: 'kids', channelOrRetailer: 'Regional Supers',  skuSharePct: 5.0, valueSharePct: 3.8, ratio: 132, projected3Y: 120 },
  { segmentId: 'kids', channelOrRetailer: 'National Supers',  skuSharePct: 5.4, valueSharePct: 3.6, ratio: 150, projected3Y: 138 },
  { segmentId: 'kids', channelOrRetailer: 'Hypers',           skuSharePct: 4.8, valueSharePct: 3.7, ratio: 130, projected3Y: 118 },
  { segmentId: 'kids', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 5.2, valueSharePct: 3.6, ratio: 144, projected3Y: 130 },
  { segmentId: 'kids', channelOrRetailer: 'Carrefour Super',  skuSharePct: 4.6, valueSharePct: 3.8, ratio: 121, projected3Y: 112 },
  { segmentId: 'kids', channelOrRetailer: 'Ahorramas',        skuSharePct: 4.4, valueSharePct: 3.7, ratio: 119, projected3Y: 110 },
  { segmentId: 'kids', channelOrRetailer: 'Mercadona',        skuSharePct: 4.2, valueSharePct: 3.5, ratio: 120, projected3Y: 115 },

  // ── Greek ── under-represented (40-72%)
  { segmentId: 'greek', channelOrRetailer: 'Discounters',      skuSharePct: 8.0, valueSharePct: 19.5, ratio: 41, projected3Y: 55 },
  { segmentId: 'greek', channelOrRetailer: 'Regional Supers',  skuSharePct: 10.2, valueSharePct: 19.0, ratio: 54, projected3Y: 65 },
  { segmentId: 'greek', channelOrRetailer: 'National Supers',  skuSharePct: 11.5, valueSharePct: 19.2, ratio: 60, projected3Y: 72 },
  { segmentId: 'greek', channelOrRetailer: 'Hypers',           skuSharePct: 13.0, valueSharePct: 19.4, ratio: 67, projected3Y: 78 },
  { segmentId: 'greek', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 13.7, valueSharePct: 19.1, ratio: 72, projected3Y: 82 },
  { segmentId: 'greek', channelOrRetailer: 'Carrefour Super',  skuSharePct: 11.0, valueSharePct: 19.3, ratio: 57, projected3Y: 68 },
  { segmentId: 'greek', channelOrRetailer: 'Ahorramas',        skuSharePct: 9.5, valueSharePct: 19.0, ratio: 50, projected3Y: 62 },
  { segmentId: 'greek', channelOrRetailer: 'Mercadona',        skuSharePct: 7.6, valueSharePct: 19.0, ratio: 40, projected3Y: 52 },

  // ── Immunity ── under-represented (54-92%)
  { segmentId: 'immunity', channelOrRetailer: 'Discounters',      skuSharePct: 8.6, valueSharePct: 15.9, ratio: 54, projected3Y: 65 },
  { segmentId: 'immunity', channelOrRetailer: 'Regional Supers',  skuSharePct: 10.4, valueSharePct: 15.5, ratio: 67, projected3Y: 76 },
  { segmentId: 'immunity', channelOrRetailer: 'National Supers',  skuSharePct: 12.0, valueSharePct: 16.0, ratio: 75, projected3Y: 84 },
  { segmentId: 'immunity', channelOrRetailer: 'Hypers',           skuSharePct: 14.2, valueSharePct: 15.8, ratio: 90, projected3Y: 95 },
  { segmentId: 'immunity', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 14.7, valueSharePct: 16.0, ratio: 92, projected3Y: 98 },
  { segmentId: 'immunity', channelOrRetailer: 'Carrefour Super',  skuSharePct: 11.5, valueSharePct: 15.7, ratio: 73, projected3Y: 82 },
  { segmentId: 'immunity', channelOrRetailer: 'Ahorramas',        skuSharePct: 10.0, valueSharePct: 15.6, ratio: 64, projected3Y: 74 },
  { segmentId: 'immunity', channelOrRetailer: 'Mercadona',        skuSharePct: 9.0, valueSharePct: 15.5, ratio: 58, projected3Y: 68 },

  // ── Bifidus ── varies (85-173%, over-represented at discounters)
  { segmentId: 'bifidus', channelOrRetailer: 'Discounters',      skuSharePct: 27.7, valueSharePct: 16.0, ratio: 173, projected3Y: 155 },
  { segmentId: 'bifidus', channelOrRetailer: 'Regional Supers',  skuSharePct: 18.0, valueSharePct: 16.2, ratio: 111, projected3Y: 105 },
  { segmentId: 'bifidus', channelOrRetailer: 'National Supers',  skuSharePct: 16.5, valueSharePct: 16.0, ratio: 103, projected3Y: 98 },
  { segmentId: 'bifidus', channelOrRetailer: 'Hypers',           skuSharePct: 14.8, valueSharePct: 15.8, ratio: 94, projected3Y: 90 },
  { segmentId: 'bifidus', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 14.2, valueSharePct: 16.0, ratio: 89, projected3Y: 85 },
  { segmentId: 'bifidus', channelOrRetailer: 'Carrefour Super',  skuSharePct: 15.5, valueSharePct: 16.1, ratio: 96, projected3Y: 92 },
  { segmentId: 'bifidus', channelOrRetailer: 'Ahorramas',        skuSharePct: 16.0, valueSharePct: 15.9, ratio: 101, projected3Y: 96 },
  { segmentId: 'bifidus', channelOrRetailer: 'Mercadona',        skuSharePct: 13.6, valueSharePct: 16.0, ratio: 85, projected3Y: 82 },

  // ── Kefir ── wild variation (40-133%)
  { segmentId: 'kefir', channelOrRetailer: 'Discounters',      skuSharePct: 1.6, valueSharePct: 4.0, ratio: 40,  projected3Y: 60 },
  { segmentId: 'kefir', channelOrRetailer: 'Regional Supers',  skuSharePct: 3.2, valueSharePct: 4.1, ratio: 78,  projected3Y: 90 },
  { segmentId: 'kefir', channelOrRetailer: 'National Supers',  skuSharePct: 4.0, valueSharePct: 3.9, ratio: 103, projected3Y: 110 },
  { segmentId: 'kefir', channelOrRetailer: 'Hypers',           skuSharePct: 5.3, valueSharePct: 4.0, ratio: 133, projected3Y: 125 },
  { segmentId: 'kefir', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 5.0, valueSharePct: 4.1, ratio: 122, projected3Y: 118 },
  { segmentId: 'kefir', channelOrRetailer: 'Carrefour Super',  skuSharePct: 3.5, valueSharePct: 4.0, ratio: 88,  projected3Y: 95 },
  { segmentId: 'kefir', channelOrRetailer: 'Ahorramas',        skuSharePct: 2.8, valueSharePct: 4.2, ratio: 67,  projected3Y: 80 },
  { segmentId: 'kefir', channelOrRetailer: 'Mercadona',        skuSharePct: 2.0, valueSharePct: 4.0, ratio: 50,  projected3Y: 65 },

  // ── Essentials/Kids ── roughly balanced (80-120%)
  { segmentId: 'essentials-kids', channelOrRetailer: 'Discounters',      skuSharePct: 28.0, valueSharePct: 30.0, ratio: 93,  projected3Y: 90 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Regional Supers',  skuSharePct: 30.5, valueSharePct: 30.2, ratio: 101, projected3Y: 98 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'National Supers',  skuSharePct: 29.0, valueSharePct: 30.0, ratio: 97,  projected3Y: 94 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Hypers',           skuSharePct: 27.5, valueSharePct: 29.8, ratio: 92,  projected3Y: 90 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 26.0, valueSharePct: 30.0, ratio: 87,  projected3Y: 85 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Carrefour Super',  skuSharePct: 31.0, valueSharePct: 29.5, ratio: 105, projected3Y: 100 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Ahorramas',        skuSharePct: 35.0, valueSharePct: 30.0, ratio: 117, projected3Y: 110 },
  { segmentId: 'essentials-kids', channelOrRetailer: 'Mercadona',        skuSharePct: 36.0, valueSharePct: 30.0, ratio: 120, projected3Y: 115 },

  // ── Cholesterol ── under-represented (60-95%)
  { segmentId: 'cholesterol', channelOrRetailer: 'Discounters',      skuSharePct: 1.8, valueSharePct: 3.0, ratio: 60,  projected3Y: 70 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Regional Supers',  skuSharePct: 2.4, valueSharePct: 3.0, ratio: 80,  projected3Y: 88 },
  { segmentId: 'cholesterol', channelOrRetailer: 'National Supers',  skuSharePct: 2.7, valueSharePct: 3.0, ratio: 90,  projected3Y: 95 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Hypers',           skuSharePct: 2.9, valueSharePct: 3.1, ratio: 94,  projected3Y: 98 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 2.9, valueSharePct: 3.0, ratio: 97,  projected3Y: 100 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Carrefour Super',  skuSharePct: 2.5, valueSharePct: 3.0, ratio: 83,  projected3Y: 90 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Ahorramas',        skuSharePct: 2.2, valueSharePct: 3.0, ratio: 73,  projected3Y: 82 },
  { segmentId: 'cholesterol', channelOrRetailer: 'Mercadona',        skuSharePct: 1.5, valueSharePct: 3.0, ratio: 50,  projected3Y: 60 },

  // ── Plant-Based ── generally under (55-90%)
  { segmentId: 'plant-based', channelOrRetailer: 'Discounters',      skuSharePct: 2.8, valueSharePct: 5.0, ratio: 56,  projected3Y: 72 },
  { segmentId: 'plant-based', channelOrRetailer: 'Regional Supers',  skuSharePct: 3.5, valueSharePct: 5.2, ratio: 67,  projected3Y: 80 },
  { segmentId: 'plant-based', channelOrRetailer: 'National Supers',  skuSharePct: 4.0, valueSharePct: 5.0, ratio: 80,  projected3Y: 90 },
  { segmentId: 'plant-based', channelOrRetailer: 'Hypers',           skuSharePct: 4.5, valueSharePct: 5.1, ratio: 88,  projected3Y: 95 },
  { segmentId: 'plant-based', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 4.6, valueSharePct: 5.1, ratio: 90,  projected3Y: 96 },
  { segmentId: 'plant-based', channelOrRetailer: 'Carrefour Super',  skuSharePct: 3.8, valueSharePct: 5.0, ratio: 76,  projected3Y: 85 },
  { segmentId: 'plant-based', channelOrRetailer: 'Ahorramas',        skuSharePct: 3.2, valueSharePct: 5.0, ratio: 64,  projected3Y: 76 },
  { segmentId: 'plant-based', channelOrRetailer: 'Mercadona',        skuSharePct: 2.8, valueSharePct: 5.0, ratio: 56,  projected3Y: 68 },

  // ── Light ── declining, mostly balanced to over (90-140%)
  { segmentId: 'light', channelOrRetailer: 'Discounters',      skuSharePct: 2.8, valueSharePct: 2.0, ratio: 140, projected3Y: 120 },
  { segmentId: 'light', channelOrRetailer: 'Regional Supers',  skuSharePct: 2.4, valueSharePct: 2.0, ratio: 120, projected3Y: 105 },
  { segmentId: 'light', channelOrRetailer: 'National Supers',  skuSharePct: 2.2, valueSharePct: 2.0, ratio: 110, projected3Y: 100 },
  { segmentId: 'light', channelOrRetailer: 'Hypers',           skuSharePct: 2.0, valueSharePct: 2.1, ratio: 95,  projected3Y: 88 },
  { segmentId: 'light', channelOrRetailer: 'Carrefour Hyper',  skuSharePct: 1.9, valueSharePct: 2.0, ratio: 95,  projected3Y: 88 },
  { segmentId: 'light', channelOrRetailer: 'Carrefour Super',  skuSharePct: 2.2, valueSharePct: 2.0, ratio: 110, projected3Y: 100 },
  { segmentId: 'light', channelOrRetailer: 'Ahorramas',        skuSharePct: 2.0, valueSharePct: 2.0, ratio: 100, projected3Y: 92 },
  { segmentId: 'light', channelOrRetailer: 'Mercadona',        skuSharePct: 1.8, valueSharePct: 2.0, ratio: 90,  projected3Y: 85 },
]
