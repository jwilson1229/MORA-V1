export type IndustryModel = {
  name: string;
  description: string;
  voicePersona: string;
  tagKeywords: string[];
  trendKeywords: string[];
  blockTerms: string[];
  minProfitMargin: number;
  aliCategoryId: string;
  aliCategoryName: string;
  aliSearchKeywords: string[];
};

export const industryConfigs: Record<string, IndustryModel> = {
  Beauty: {
    name: 'Beauty & Health',
    description: `I'm MORA, your beauty market expert. I specialize in trending skincare tools, cosmetics, and personal care bundles. I monitor surging beauty trends and match them to your product line for smart growth.`,
    voicePersona: 'bubbly and confident, like a beauty YouTuber meets a product strategist.',
    tagKeywords: ['skincare', 'moisturizer', 'anti-aging', 'mask', 'serum', 'makeup', 'glow'],
    trendKeywords: ['acne', 'beauty tool', 'sunscreen', 'wrinkle', 'led facial', 'blackhead remover'],
    blockTerms: ['celebrity', 'scandal', 'meme', 'lyrics', 'drama'],
    minProfitMargin: 30,
    aliCategoryId: '66', // "Beauty & Health"
    aliCategoryName: 'Beauty & Health',
    aliSearchKeywords: ['facial cleanser', 'beauty device', 'face massager', 'led therapy mask'],
  },

  Electronics: {
    name: 'Consumer Electronics',
    description: `I'm MORA, your electronics intelligence unit. I find trending gadgets, chargers, wearables, and utility tools—then match them to the hottest buyer intent across the web.`,
    voicePersona: 'fast, logical, and slightly sarcastic—like a smart home device that reads Hacker News.',
    tagKeywords: ['gadget', 'bluetooth', 'charger', 'usb', 'smartwatch', 'earbuds'],
    trendKeywords: ['power bank', 'smart home', 'wireless', 'portable speaker', 'earbuds'],
    blockTerms: ['crypto', 'politics', 'leak', 'hacker'],
    minProfitMargin: 25,
    aliCategoryId: '44', // "Consumer Electronics"
    aliCategoryName: 'Consumer Electronics',
    aliSearchKeywords: ['wireless earbuds', 'smart plug', 'usb hub', 'action camera'],
  },

  Home: {
    name: 'Home Improvement & Tools',
    description: `I'm MORA, your home tools strategist. I identify trending home fixes, smart utilities, and DIY tools—then help your store lead the solution space.`,
    voicePersona: 'calm and clever, like a helpful engineer with a YouTube channel.',
    tagKeywords: ['drill', 'screwdriver', 'home repair', 'multitool', 'electric tool'],
    trendKeywords: ['power tools', 'smart switch', 'home kit', 'tool set'],
    blockTerms: ['sports', 'movie', 'celebrity', 'music'],
    minProfitMargin: 30,
    aliCategoryId: '39', // "Tools"
    aliCategoryName: 'Tools',
    aliSearchKeywords: ['mini drill', 'smart tool', 'home toolkit', 'laser measure'],
  },

  Fashion: {
    name: 'Women’s Fashion',
    description: `I'm MORA, your trend-sniffing fashion scout. I stay ahead of global style spikes and help your store ride the next wave of viral outfits.`,
    voicePersona: 'trendy and energetic, like a TikTok fashion influencer who understands SEO.',
    tagKeywords: ['dress', 'bag', 'aesthetic', 'summer', 'korean', 'vintage'],
    trendKeywords: ['summer dress', 'crossbody bag', 'casual wear', 'minimalist fashion'],
    blockTerms: ['gossip', 'celebrity', 'movie', 'controversy'],
    minProfitMargin: 35,
    aliCategoryId: '100003109', // "Women's Clothing"
    aliCategoryName: "Women's Clothing",
    aliSearchKeywords: ['midi dress', 'tank top', 'vintage blouse', 'minimalist bag'],
  },

  Agriculture: {
    name: 'Agricultural Equipment',
    description: `I'm MORA, your agri-tech automation partner. I help identify high-demand tools like sensors, soil kits, irrigation tools, and automation gear across emerging markets.`,
    voicePersona: 'grounded and practical, with a wise-farmer tone but tech-savvy edge.',
    tagKeywords: ['sensor', 'soil', 'irrigation', 'farm tool', 'moisture'],
    trendKeywords: ['fertilizer', 'drought', 'soil sensor', 'pH kit', 'greenhouse'],
    blockTerms: ['war', 'politics', 'celebrity', 'football'],
    minProfitMargin: 40,
    aliCategoryId: '200216823', // "Agricultural Machinery"
    aliCategoryName: 'Agricultural Machinery',
    aliSearchKeywords: ['soil tester', 'moisture sensor', 'irrigation kit', 'greenhouse cover'],
  },
};
