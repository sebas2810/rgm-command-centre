export interface StrategicChoice {
  groupName: string        // e.g. "Bifidus / Greek / Protein / Light"
  wobPct: number           // weight of business
  brands: {
    brandId: string
    brandName: string
    sharePct: number
    shareDeltaPp: number
    gpPct: number
    profitRole: string     // "Profit Driver", "Revenue Driver", etc.
    strategy: string       // "Turnaround", "Grow Share", etc.
    actions: string[]
  }[]
}

export const strategicChoices: StrategicChoice[] = [
  {
    groupName: 'Bifidus / Greek / Protein / Light',
    wobPct: 44,
    brands: [
      {
        brandId: 'activia-bifidus',
        brandName: 'Activia Bifidus',
        sharePct: 63.9,
        shareDeltaPp: -5.0,
        gpPct: 38.1,
        profitRole: 'Profit Driver',
        strategy: 'Turnaround',
        actions: [
          'Prioritize 2\u20AC/3\u20AC/4\u20AC price points',
          'Reduce perceived premium vs other segments',
          'Explore entry into <2\u20AC range',
        ],
      },
      {
        brandId: 'oikos-greek',
        brandName: 'Oikos Greek',
        sharePct: 12.0,
        shareDeltaPp: 4.6,
        gpPct: 27.7,
        profitRole: 'Profit Driver',
        strategy: 'Grow Share',
        actions: [
          'Maximize consumption through optimized large pot offering',
          'Reduce cannibalization of Oikos',
        ],
      },
      {
        brandId: 'griego-greek',
        brandName: 'Griego Greek',
        sharePct: 13.4,
        shareDeltaPp: -2.3,
        gpPct: 22.3,
        profitRole: 'Fix Profitability',
        strategy: 'Fix Profitability',
        actions: [
          'Move to 1.5-1.99\u20AC to maximize value',
          'Reduce cannibalization',
        ],
      },
      {
        brandId: 'yopro-protein',
        brandName: 'YoPRO Protein',
        sharePct: 35.0,
        shareDeltaPp: -7.6,
        gpPct: 28.4,
        profitRole: 'Profit Driver',
        strategy: 'Turnaround',
        actions: [
          'Play in <2\u20AC through down-sizing',
          'Maximize consumption offerings',
          'Consider Lactose free',
        ],
      },
      {
        brandId: 'proteina',
        brandName: 'Proteina',
        sharePct: 0,
        shareDeltaPp: 0,
        gpPct: 10.5,
        profitRole: 'Fix Profitability',
        strategy: 'Fix Profitability',
        actions: [],
      },
    ],
  },
  {
    groupName: 'Essentials / Kids',
    wobPct: 30,
    brands: [
      {
        brandId: 'danone-essentials',
        brandName: 'Danone Essentials',
        sharePct: 27.3,
        shareDeltaPp: -0.5,
        gpPct: 15.0,
        profitRole: 'Volume Driver',
        strategy: 'Maintain',
        actions: [
          'Evaluate straight pricing',
          'Recover volume via large sizes and other discounters',
        ],
      },
      {
        brandId: 'activia-kefir',
        brandName: 'Activia Kefir',
        sharePct: 6.8,
        shareDeltaPp: 1.9,
        gpPct: 10.5,
        profitRole: 'Growth Driver',
        strategy: 'Accelerate',
        actions: [
          'Play in Key Sizes and Price Ranges: 450-650g & <1.5\u20AC',
          'Expand in discounters',
        ],
      },
    ],
  },
  {
    groupName: 'Immunity / Cholesterol',
    wobPct: 16,
    brands: [
      {
        brandId: 'actimel',
        brandName: 'Actimel',
        sharePct: 61.3,
        shareDeltaPp: 1.8,
        gpPct: 42.5,
        profitRole: 'Revenue & Profit Driver',
        strategy: 'Accelerate',
        actions: [
          'Explore entry lower cash outlay',
          'Expand to Spoons',
        ],
      },
      {
        brandId: 'danacol',
        brandName: 'Danacol',
        sharePct: 88.7,
        shareDeltaPp: 1.0,
        gpPct: 50.0,
        profitRole: 'Revenue & Profit Driver',
        strategy: 'Accelerate',
        actions: [
          'Room to be more accessible via lower cash outlay',
        ],
      },
    ],
  },
  {
    groupName: 'Plant-Based',
    wobPct: 5,
    brands: [
      {
        brandId: 'alpro',
        brandName: 'Alpro',
        sharePct: 76.3,
        shareDeltaPp: 5.7,
        gpPct: 27.4,
        profitRole: 'Growth Driver',
        strategy: 'Maximize',
        actions: [
          'Maximize by mirroring yogurt product proposition and Price Pack Architecture',
        ],
      },
    ],
  },
]
