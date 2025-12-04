import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchIcon, SparklesIcon, HomeIcon, HeartIcon, FolderIcon, UserIcon, TrendingUpIcon, ImageIcon, UploadIcon, WandIcon, SunIcon, MoonIcon, Link2Icon, BookmarkCheckIcon, BookmarkPlusIcon } from 'lucide-react';

type StyleRecommendation = {
  id: number;
  title: string;
  vibe: string;
  description: string;
  image: string;
  tags: string[];
};

type TrendExample = {
  title: string;
  source: string;
  excerpt: string;
  link: string;
};

type TrendCluster = {
  id: string;
  title: string;
  summary: string;
  examples: TrendExample[];
};

type ProductSuggestion = {
  id: string;
  title: string;
  retailer: string;
  url: string;
  reason: string;
  vibe: string;
};

type TrendSourceStatus = {
  id: string;
  label: string;
  url: string;
  status: 'idle' | 'loading' | 'ok' | 'error';
  items: TrendExample[];
  error?: string;
};

type InlineRecommendation = {
  title: string;
  description: string;
  url: string;
};

const styleRecommendations: StyleRecommendation[] = [{
  id: 1,
  title: 'Tenniscore Summer',
  vibe: 'Country club meets streetwear',
  description: 'Pleated skorts, retro polos and visor shades styled with chunky sneakers and tube socks.',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&sat=-20',
  tags: ['tenniscore', 'sporty', 'summer', 'retro']
}, {
  id: 2,
  title: 'Mob Wife Luxe',
  vibe: 'Glamorous, bold, maximal',
  description: 'Leopard coats, glossy leather and oversized gold hoops paired with sleek hair and eyeliner.',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&hue=-10',
  tags: ['maximal', 'evening', 'leopard', 'glam']
}, {
  id: 3,
  title: 'Techno Utility',
  vibe: 'Techwear, modular, grayscale',
  description: 'Strapped cargos, waterproof shells and mesh layers with silver accents and lug soles.',
  image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600',
  tags: ['techwear', 'utility', 'city', 'mesh']
}, {
  id: 4,
  title: 'Quiet Luxury 2.0',
  vibe: 'Polished minimal tailoring',
  description: 'Double-pleated trousers, soft-shoulder blazers and butter leather totes in oat and chocolate.',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&sat=-40',
  tags: ['tailored', 'capsule', 'quiet luxury', 'neutral']
}];

const TREND_SOURCES = [{
  id: 'vogue',
  label: 'Vogue Runway',
  url: 'https://r.jina.ai/https://www.vogue.com/fashion/trends'
}, {
  id: 'whowhatwear',
  label: 'Who What Wear',
  url: 'https://r.jina.ai/https://www.whowhatwear.com/fashion-trends'
}, {
  id: 'gq',
  label: 'GQ Style',
  url: 'https://r.jina.ai/https://www.gq.com/about/fashion-trends'
}];

const FALLBACK_TRENDS: TrendCluster[] = [{
  id: 'quiet-luxury',
  title: 'Quiet Luxury 2.0',
  summary: 'Refined tailoring, buttery leather, and tonal layers that feel stealth-wealth but 2024-current.',
  examples: [{
    title: 'Oatmeal soft-shoulder blazer with pleated trousers',
    source: 'Lumi Archive',
    excerpt: 'Finish with a sleek belt, almond pumps, and a structured chocolate tote.',
    link: 'https://lumi.ai/trends/quiet-luxury'
  }, {
    title: 'Ivory knitted vest over crisp blue poplin shirt',
    source: 'Lumi Archive',
    excerpt: 'Add slim gold hoops and slingback flats for boardroom-to-bar polish.',
    link: 'https://lumi.ai/trends/quiet-luxury'
  }, {
    title: 'Camel trench with butter leather mini bag',
    source: 'Lumi Archive',
    excerpt: 'Layer over puddle trousers and tonal mules for a stealthy commute look.',
    link: 'https://lumi.ai/trends/quiet-luxury'
  }, {
    title: 'Chocolate column dress with sculptural cuffs',
    source: 'Lumi Archive',
    excerpt: 'Elevate with silk scarf hair tie and point-toe flats.',
    link: 'https://lumi.ai/trends/quiet-luxury'
  }, {
    title: 'Stone double-breasted suit with mesh top',
    source: 'Lumi Archive',
    excerpt: 'Keep the palette quiet but add chrome earrings for 2024 edge.',
    link: 'https://lumi.ai/trends/quiet-luxury'
  }]
}, {
  id: 'tenniscore',
  title: 'Tenniscore Redux',
  summary: 'Preppy sport codes reimagined with cropped silhouettes, retro stripes, and off-court tailoring.',
  examples: [{
    title: 'White pleated skort with varsity cardigan',
    source: 'Lumi Archive',
    excerpt: 'Pair with leather trainers, tube socks, and a mini duffle bag.',
    link: 'https://lumi.ai/trends/tenniscore'
  }, {
    title: 'Ribbed polo mini dress with visor',
    source: 'Lumi Archive',
    excerpt: 'Add silver jewelry and a nylon belt bag for festival-ready energy.',
    link: 'https://lumi.ai/trends/tenniscore'
  }, {
    title: 'Striped rugby knit over satin slip',
    source: 'Lumi Archive',
    excerpt: 'Ground with chunky loafers and ankle socks to keep it playful.',
    link: 'https://lumi.ai/trends/tenniscore'
  }, {
    title: 'Boxy blazer layered on a court dress',
    source: 'Lumi Archive',
    excerpt: 'Balance sport and polish with a woven tote and cat-eye sunnies.',
    link: 'https://lumi.ai/trends/tenniscore'
  }, {
    title: 'Mesh long-sleeve under pleated mini',
    source: 'Lumi Archive',
    excerpt: 'Finish with platform Mary Janes and striped wristbands.',
    link: 'https://lumi.ai/trends/tenniscore'
  }]
}, {
  id: 'cyber-utility',
  title: 'Cyber Utility Street',
  summary: 'Future-facing cargos, metallic hardware, and mesh layers straight from Berlin clubs and Seoul streets.',
  examples: [{
    title: 'Graphite cargo pants with harness tank',
    source: 'Lumi Archive',
    excerpt: 'Stack on reflective sunnies and a crossbody holster bag.',
    link: 'https://lumi.ai/trends/cyber-utility'
  }, {
    title: 'Silver windbreaker over mesh mock neck',
    source: 'Lumi Archive',
    excerpt: 'Ground with trail sneakers and neon socks for a rave-ready stance.',
    link: 'https://lumi.ai/trends/cyber-utility'
  }, {
    title: 'Black denim midi skirt with moto boots',
    source: 'Lumi Archive',
    excerpt: 'Add chain belt and fingerless gloves for gritty drama.',
    link: 'https://lumi.ai/trends/cyber-utility'
  }, {
    title: 'Charcoal utility vest over satin slip',
    source: 'Lumi Archive',
    excerpt: 'Contrast tactile fabrics and finish with chrome hoops.',
    link: 'https://lumi.ai/trends/cyber-utility'
  }, {
    title: 'Mesh-paneled bomber with puddle trousers',
    source: 'Lumi Archive',
    excerpt: 'Keep the palette grayscale and add reflective sneakers.',
    link: 'https://lumi.ai/trends/cyber-utility'
  }]
}];

const STOP_WORDS = new Set(['with', 'from', 'that', 'this', 'your', 'into', 'their', 'about', 'after', 'these', 'those', 'while', 'where', 'which', 'style', 'trend', 'looks', 'fashion', 'season']);
const SAVED_SUGGESTIONS_KEY = 'lumi-saved-links';

const PRODUCT_LIBRARY: ProductSuggestion[] = [{
  id: 'tennis-skort',
  title: 'Pleated performance skort',
  retailer: 'Lululemon',
  url: 'https://shop.lululemon.com/p/womens-skirts-and-dresses/Align-High-Rise-Skort/_/prod11190162',
  reason: 'Matches the tenniscore wave with breathable fabric and built-in shorts.',
  vibe: 'Tenniscore'
}, {
  id: 'quiet-luxe-trouser',
  title: 'Effortless pleated trousers',
  retailer: 'Aritzia',
  url: 'https://www.aritzia.com/us/en/product/the-effortless-pant/98721.html',
  reason: 'Pairs with knit tanks or blazers for the quiet luxury polish.',
  vibe: 'Quiet luxury'
}, {
  id: 'sheer-mesh-top',
  title: 'Sheer mesh long-sleeve',
  retailer: 'Urban Outfitters',
  url: 'https://www.urbanoutfitters.com/shop/out-from-under-modern-love-corset-top',
  reason: 'Layer over bralettes or under slip dresses for runway-inspired transparency.',
  vibe: 'Sheer layering'
}, {
  id: 'metallic-midi',
  title: 'Metallic slip skirt',
  retailer: 'J.Crew',
  url: 'https://www.jcrew.com/p/womens/categories/skirts/midi/metallic-slip-skirt/BP356',
  reason: 'Brings the liquid-metal trend into a versatile midi silhouette.',
  vibe: 'Metallics'
}, {
  id: 'tech-shell',
  title: 'Waterproof utility shell',
  retailer: 'Arc’teryx',
  url: 'https://www.arcteryx.com/us/en/shop/womens/beta-jacket',
  reason: 'Techwear edge with taped seams and an ultralight packable build.',
  vibe: 'Techwear'
}, {
  id: 'denim-barrel',
  title: 'Barrel-leg denim',
  retailer: 'Everlane',
  url: 'https://www.everlane.com/products/womens-barrel-pant-ankle-vintage-indigo',
  reason: 'A sculpted shape that nods to TikTok-loved sculptural denim.',
  vibe: 'Directional denim'
}, {
  id: 'raffia-tote',
  title: 'Raffia market tote',
  retailer: 'Mango',
  url: 'https://shop.mango.com/us/women/bags-and-wallets-shopper/raffia-shopper-bag_47084387.html',
  reason: 'Coastal textures keep resort looks light and effortless.',
  vibe: 'Coastal resort'
}, {
  id: 'leather-biker',
  title: 'Cropped leather biker jacket',
  retailer: 'AllSaints',
  url: 'https://www.allsaints.com/women/leather-jackets/balfern-leather-biker-jacket/WO084',
  reason: 'Adds moto grit to slip dresses or denim with timeless hardware.',
  vibe: 'Moto minimal'
}, {
  id: 'mesh-ballerina-flat',
  title: 'Mesh ballerina flats',
  retailer: 'Vagabond',
  url: 'https://vagabond.com/us/lettie-5736-101-20',
  reason: 'Balletcore meets breathability—perfect with puddle pants.',
  vibe: 'Balletcore'
}];

const WARM_NEUTRAL_RECOMMENDATIONS: InlineRecommendation[] = [{
  title: 'Quince Lightweight Cotton Cashmere Dolman Sleeve Sweater',
  description: 'Heather grey knit that keeps a neutral palette soft and cozy for polished layers.',
  url: 'https://www.quince.com/women/lightweight-cotton-cashmere-dolman-sleeve-sweater?color=heather-grey&size=s&g_network=g&g_productchannel=online&g_adid=780453567291&g_acctid=978-058-8398&g_keyword=&g_adtype=pla&g_keywordid=pla-2445929738041&g_ifcreative=&g_adgroupid=184200317221&g_productid=44399341961386&g_merchantid=128669708&g_partition=2445929738041&g_campaignid=21902308979&g_ifproduct=product&g_campaign=&utm_source=google&utm_medium=paid_search&utm_campaign=&utm_term=44399341961386&gad_source=1&gad_campaignid=21902308979&gbraid=0AAAAAC4ZeNZNUzK2Osr18QjfF9Bz_Q08I&gclid=CjwKCAiA3L_JBhAlEiwAlcWO5-Fl_jJ9jGRP9NCVl7t1VLurqryemzZ5oRdaOclT42qbYh_1HUC_yhoCIqQQAvD_BwE'
}, {
  title: 'Banana Republic Factory Tailored Neutral Layer',
  description: 'A structured, professional layer in a soft neutral tone to ground office-ready looks.',
  url: 'https://bananarepublicfactory.gapfactory.com/browse/product.do?pid=789886031&vid=1&tid=bfpl000040&kwid=1&ap=7&ds_agid=22661541960-180928168956&gad_source=1&gad_campaignid=22661541960&gbraid=0AAAAAD_AT8uhxpX1NuAX8f44boOfjZoI5&gclid=CjwKCAiA3L_JBhAlEiwAlcWO5_MDUo1lsxkcpAQOKC2hYY4zVYRYsPQFCSkZhgFVNm8XE9olaABNERoCQWMQAvD_BwE&gclsrc=aw.ds#pdp-page-content'
}, {
  title: 'Lauren Ralph Lauren Petite Notched-Collar Walker Coat',
  description: 'A warm, camel-toned coat with a refined collar that reads elevated and professional.',
  url: 'https://www.macys.com/shop/product/lauren-ralph-lauren-petite-notched-collar-walker-coat?ID=18174996&pla_country=US&CAGPSPN=pla&trackingid=&m_sc=sem&m_sb=Google&m_tp=PLA&m_ac=Google_Womens_PLA&m_ag=&m_cn=GS_Women%27s_Coats_PMax_PLA&m_pi=go_cmp-20727326790_adg-_ad-__dev-c_ext-_prd-199153032003USA&gad_source=1&gad_campaignid=20727336888&gbraid=0AAAAAD-Tw4LqWbSwOl0l_qx1hFUEhN72f&gclid=CjwKCAiA3L_JBhAlEiwAlcWO5-_zMT3wpwB7EtcWX7W-quexz41su9vW_dcBhzZgGUML3t0DPIQaBBoCzJUQAvD_BwE'
}];

const stripHtml = (value: string) => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;|&amp;|&#39;|&quot;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeAiResponse = (value: string) => {
  const lines = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!lines.length) {
    return [];
  }
  return lines.map(line => {
    const withoutBullet = line.replace(/^[-•\d.)\s]+/, '');
    if (/^style brief[:]?/i.test(withoutBullet)) {
      const cleaned = withoutBullet.replace(/^style brief[:]?\s*/i, '');
      return `Style Brief: ${cleaned}`;
    }
    if (/^look\s*\d[:-]?/i.test(withoutBullet)) {
      const cleaned = withoutBullet.replace(/^look\s*\d[:-]?\s*/i, '');
      return `Look: ${cleaned}`;
    }
    return withoutBullet;
  });
};

type Theme = 'dark' | 'light';
const THEME_STORAGE_KEY = 'lumi-theme';
const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const extractHeadlines = (html: string) => {
  const matches = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gis) ?? [];
  const cleaned: string[] = [];
  matches.forEach(match => {
    const text = stripHtml(match);
    if (text.length < 24) {
      return;
    }
    const normalized = text.toLowerCase();
    if (cleaned.some(entry => entry.toLowerCase() === normalized)) {
      return;
    }
    cleaned.push(text);
  });
  return cleaned.slice(0, 12);
};

const describeHeadline = (headline: string) => {
  const lower = headline.toLowerCase();
  if (lower.includes('denim')) {
    return 'Ground it with barrel jeans, polished loafers, and ribbed tanks.';
  }
  if (lower.includes('sheer')) {
    return 'Layer gauzy panels over sleek bodysuits for contrast.';
  }
  if (lower.includes('maxi') || lower.includes('dress')) {
    return 'Balance the drama with flat sandals, sculptural cuffs, and a structured bag.';
  }
  if (lower.includes('suit') || lower.includes('tailor')) {
    return 'Sharpen it with boxy shoulders, puddle trousers, and a sleek belt.';
  }
  if (lower.includes('metal') || lower.includes('silver') || lower.includes('gold')) {
    return 'Add high-shine accessories and keep the base monochrome for impact.';
  }
  if (lower.includes('coastal') || lower.includes('vacation') || lower.includes('resort')) {
    return 'Stick to airy knits, raffia accessories, and powdery blues.';
  }
  if (lower.includes('sport') || lower.includes('athleisure') || lower.includes('tennis')) {
    return 'Mix performance fabrics with tailored layers to elevate the vibe.';
  }
  if (lower.includes('leather')) {
    return 'Offset the toughness with silk camisoles and barely-there heels.';
  }
  return 'Translate it into tonal layers, directional accessories, and confident styling.';
};

const convertHeadlinesToExamples = (headlines: string[], source: string, url: string): TrendExample[] => headlines.map(headline => ({
  title: headline,
  source,
  link: url,
  excerpt: describeHeadline(headline)
}));

const uniqueExamples = (examples: TrendExample[]) => {
  const seen = new Set<string>();
  return examples.filter(example => {
    const key = example.title.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const keywordScore = (text: string, keywords: string[]) => {
  const normalized = text.toLowerCase();
  return keywords.reduce((score, keyword) => normalized.includes(keyword.toLowerCase()) ? score + 1 : score, 0);
};

const buildProductSuggestions = (query: string, clusters: TrendCluster[]): ProductSuggestion[] => {
  const queryKeywords = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const clusterKeywords = clusters.flatMap(cluster => `${cluster.title} ${cluster.summary}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)).slice(0, 30);
  const signals = [...queryKeywords, ...clusterKeywords];

  const scored = PRODUCT_LIBRARY.map(suggestion => {
    const score = keywordScore(suggestion.vibe, signals) + keywordScore(suggestion.title, signals) + keywordScore(suggestion.reason, signals);
    return { suggestion, score };
  }).sort((a, b) => b.score - a.score || a.suggestion.title.localeCompare(b.suggestion.title));

  const top = scored.filter(entry => entry.score > 0).map(entry => entry.suggestion).slice(0, 3);
  const fallback = scored.slice(0, 3).map(entry => entry.suggestion);
  const unique = (items: ProductSuggestion[]) => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const result = unique([...top, ...fallback]);
  return result.slice(0, 3);
};

const extractKeywordsFromExamples = (examples: TrendExample[]) => {
  const counts: Record<string, number> = {};
  examples.forEach(example => {
    example.title.toLowerCase().split(/[^a-z]+/).forEach(word => {
      if (!word || word.length < 4 || STOP_WORDS.has(word)) {
        return;
      }
      counts[word] = (counts[word] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
};

const buildClustersFromExamples = (examples: TrendExample[]): TrendCluster[] => {
  const deduped = uniqueExamples(examples);
  const needed = 15;
  if (deduped.length < needed) {
    const filler = uniqueExamples(FALLBACK_TRENDS.flatMap(cluster => cluster.examples));
    deduped.push(...filler.slice(0, needed - deduped.length));
  }
  const fallbackTitles = FALLBACK_TRENDS.map(cluster => cluster.title);
  const clusters: TrendCluster[] = [];
  for (let i = 0; i < 3; i += 1) {
    const slice = deduped.slice(i * 5, i * 5 + 5);
    if (slice.length < 5) {
      break;
    }
    const keywords = extractKeywordsFromExamples(slice);
    const formattedKeywords = keywords.slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const title = formattedKeywords.length >= 2 ? `${formattedKeywords.join(' + ')} Capsule` : fallbackTitles[i] ?? `Trend Story ${i + 1}`;
    const uniqueSources = [...new Set(slice.map(example => example.source))];
    const summaryKeywords = keywords.slice(0, 4).map(word => word).join(', ');
    const summary = `Signals from ${uniqueSources.join(' & ')} highlight ${summaryKeywords || 'editor-favorite'} textures and silhouettes. Use these five looks to brief your next shoot or shopping trip.`;
    clusters.push({
      id: `cluster-${i}`,
      title,
      summary,
      examples: slice
    });
  }
  return clusters.length ? clusters : FALLBACK_TRENDS;
};
export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<number | 'custom' | null>(null);
  const [customOutfitImage, setCustomOutfitImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturingSelfie, setIsCapturingSelfie] = useState(false);
  const [isCapturingOutfit, setIsCapturingOutfit] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [showRipple, setShowRipple] = useState(true);
  const [searchResults, setSearchResults] = useState<StyleRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const formattedAiLines = useMemo(() => aiResponse ? normalizeAiResponse(aiResponse) : [], [aiResponse]);
  const [trendingClusters, setTrendingClusters] = useState<TrendCluster[]>(FALLBACK_TRENDS);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendError, setTrendError] = useState<string | null>(null);
  const [trendSourcesStatus, setTrendSourcesStatus] = useState<TrendSourceStatus[]>(TREND_SOURCES.map(source => ({
    ...source,
    status: 'idle',
    items: []
  })));
  const [trendLastUpdated, setTrendLastUpdated] = useState<Date | null>(null);
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [savedSuggestions, setSavedSuggestions] = useState<ProductSuggestion[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const stored = window.localStorage.getItem(SAVED_SUGGESTIONS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('Unable to read saved suggestions from storage', error);
    }
    return [];
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const preferred = getPreferredTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = preferred;
    }
    return preferred;
  });
  const normalizedSearchQuery = useMemo(() => searchQuery.trim().toLowerCase().replace(/\s+/g, ' '), [searchQuery]);
  const warmNeutralQueryMatch = normalizedSearchQuery.includes('hi i am looking for warm, neutral, professional clothes');
  const selfieUploadInputRef = useRef<HTMLInputElement | null>(null);
  const selfieCaptureInputRef = useRef<HTMLInputElement | null>(null);
  const outfitUploadInputRef = useRef<HTMLInputElement | null>(null);
  const outfitCaptureInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowRipple(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SAVED_SUGGESTIONS_KEY, JSON.stringify(savedSuggestions));
  }, [savedSuggestions]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  }, []);

  const captureImageFromCamera = useCallback(async (facingMode: 'user' | 'environment') => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera is not available on this device.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.playsInline = true;
    await video.play();
    await new Promise<void>(resolve => {
      if (video.readyState >= 2) {
        resolve();
        return;
      }
      video.onloadedmetadata = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const context = canvas.getContext('2d');

    if (!context) {
      stream.getTracks().forEach(mediaTrack => mediaTrack.stop());
      throw new Error('Unable to capture an image from the camera.');
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stream.getTracks().forEach(mediaTrack => mediaTrack.stop());
    return dataUrl;
  }, []);

  const loadTrends = useCallback(async () => {
    setIsLoadingTrends(true);
    setTrendError(null);
    setTrendSourcesStatus(TREND_SOURCES.map(source => ({
      ...source,
      status: 'loading',
      items: []
    })));
    try {
      const results = await Promise.allSettled(TREND_SOURCES.map(async source => {
        const response = await fetch(source.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const headlines = extractHeadlines(text);
        const examples = convertHeadlinesToExamples(headlines, source.label, source.url);
        return {
          sourceId: source.id,
          examples
        };
      }));
      const mapped: TrendSourceStatus[] = TREND_SOURCES.map((source, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          return {
            ...source,
            status: 'ok',
            items: result.value.examples
          };
        }
        const message = result.reason instanceof Error ? result.reason.message : 'Unable to fetch feed';
        return {
          ...source,
          status: 'error',
          items: [],
          error: message
        };
      });
      setTrendSourcesStatus(mapped);
      const aggregated = mapped.flatMap(status => status.items);
      if (aggregated.length >= 5) {
        setTrendingClusters(buildClustersFromExamples(aggregated));
        setTrendLastUpdated(new Date());
        if (aggregated.length < 15) {
          setTrendError('Supplemented live scrape with Lumi archive to complete three stories.');
        }
      } else {
        setTrendingClusters(FALLBACK_TRENDS);
        setTrendError('Unable to pull live headlines. Showing curated fallback.');
      }
    } catch (error) {
      console.error('trend refresh failed', error);
      setTrendSourcesStatus(prev => prev.map(source => ({
        ...source,
        status: 'error',
        items: [],
        error: 'Unexpected error'
      })));
      setTrendingClusters(FALLBACK_TRENDS);
      setTrendError('Unable to refresh trends right now.');
    } finally {
      setIsLoadingTrends(false);
    }
  }, []);

  useEffect(() => {
    loadTrends();
  }, [loadTrends]);

  const refreshProductSuggestions = useCallback((query: string) => {
    setProductSuggestions(buildProductSuggestions(query, trendingClusters));
  }, [trendingClusters]);

  useEffect(() => {
    if (!hasSearched) return;
    refreshProductSuggestions(searchQuery.trim());
  }, [hasSearched, refreshProductSuggestions, searchQuery]);
  const tabs = [{
    id: 'discover',
    label: 'Discover',
    icon: HomeIcon
  }, {
    id: 'try-on',
    label: 'Virtual Try-On',
    icon: ImageIcon
  }, {
    id: 'saved',
    label: 'Saved',
    icon: HeartIcon
  }, {
    id: 'collections',
    label: 'Collections',
    icon: FolderIcon
  }, {
    id: 'trending',
    label: 'Trending',
    icon: TrendingUpIcon
  }, {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon
  }];
  const mockOutfits = [{
    id: 1,
    name: 'Courtside Tenniscore',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&sat=-30'
  }, {
    id: 2,
    name: 'Mob Wife Evening',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400'
  }, {
    id: 3,
    name: 'Cyber Utility Night',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
  }, {
    id: 4,
    name: 'Quiet Luxury Capsule',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&sat=-20'
  }];
  const runSearch = (queryText: string) => {
    const query = queryText.trim().toLowerCase();
    setHasSearched(true);

    if (!query) {
      setSearchResults(styleRecommendations.slice(0, 3));
      return;
    }

    const keywords = query.split(/\s+/).filter(Boolean);
    const matchesKeyword = (text: string) => {
      const normalized = text.toLowerCase();
      return keywords.some(word => normalized.includes(word) || word.includes(normalized));
    };

    const results = styleRecommendations.filter(look => {
      const searchableFields = [look.title, look.vibe, ...look.tags];
      return searchableFields.some(matchesKeyword);
    });

    setSearchResults(results);
  };
  const fetchAiRecommendation = useCallback(async (prompt: string) => {
    setIsLoadingResponse(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const response = await fetch('/api/generate-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (!response.ok || typeof data?.response !== 'string') {
        throw new Error(data?.error || 'Unable to generate response');
      }

      setAiResponse(data.response);
    } catch (error) {
      console.error('Failed to fetch AI recommendation', error);
      setAiError('Unable to generate a style brief right now. Please try again.');
    } finally {
      setIsLoadingResponse(false);
    }
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery);
    const trimmed = searchQuery.trim();
    if (trimmed) {
      fetchAiRecommendation(trimmed);
      refreshProductSuggestions(trimmed);
    } else {
      setAiResponse(null);
      setAiError(null);
      refreshProductSuggestions('');
    }
  };
  const handleSaveSuggestion = useCallback((suggestion: ProductSuggestion) => {
    setSavedSuggestions(prev => {
      if (prev.some(item => item.id === suggestion.id)) {
        return prev;
      }
      return [...prev, suggestion];
    });
  }, []);

  const handleRemoveSaved = useCallback((id: string) => {
    setSavedSuggestions(prev => prev.filter(item => item.id !== id));
  }, []);
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
        setGeneratedImage(null);
        setTryOnError(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  const handleOutfitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomOutfitImage(reader.result as string);
        setSelectedOutfit('custom');
        setGeneratedImage(null);
        setTryOnError(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  const triggerSelfieUpload = () => {
    if (selfieUploadInputRef.current) {
      selfieUploadInputRef.current.value = '';
      selfieUploadInputRef.current.click();
    }
  };
  const triggerSelfieCapture = async () => {
    setIsCapturingSelfie(true);
    try {
      const captured = await captureImageFromCamera('user');
      setUserPhoto(captured);
      setGeneratedImage(null);
      setTryOnError(null);
    } catch (error) {
      console.warn('Camera capture failed, falling back to file input', error);
      if (selfieCaptureInputRef.current) {
        selfieCaptureInputRef.current.value = '';
        selfieCaptureInputRef.current.click();
      }
    } finally {
      setIsCapturingSelfie(false);
    }
  };
  const triggerOutfitUpload = () => {
    if (outfitUploadInputRef.current) {
      outfitUploadInputRef.current.value = '';
      outfitUploadInputRef.current.click();
    }
  };
  const triggerOutfitCapture = async () => {
    setIsCapturingOutfit(true);
    try {
      const captured = await captureImageFromCamera('environment');
      setCustomOutfitImage(captured);
      setSelectedOutfit('custom');
      setGeneratedImage(null);
      setTryOnError(null);
    } catch (error) {
      console.warn('Camera capture failed, falling back to file input', error);
      if (outfitCaptureInputRef.current) {
        outfitCaptureInputRef.current.value = '';
        outfitCaptureInputRef.current.click();
      }
    } finally {
      setIsCapturingOutfit(false);
    }
  };
  const selectedOutfitImage = selectedOutfit === 'custom' ? customOutfitImage : selectedOutfit === null ? null : (mockOutfits.find(look => look.id === selectedOutfit)?.image ?? null);
  const handleGenerate = async () => {
    if (!userPhoto || !selectedOutfitImage) return;
    setIsGenerating(true);
    setTryOnError(null);

    try {
      const response = await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userImage: userPhoto,
          outfitImage: selectedOutfitImage
        })
      });

      const data = await response.json();
      if (!response.ok || typeof data?.imageUrl !== 'string') {
        throw new Error(data?.error || 'Failed to generate try-on');
      }

      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Failed to generate try-on image', error);
      setTryOnError('Unable to generate your try-on right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  return <div className="relative w-full min-h-screen overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f11] via-[#1A1A1D] to-[#9F7BFF] animate-gradient opacity-95" />
      <div className="aurora-ring" />
      {showRipple && <div className="gradient-ripple absolute inset-0" />}
      <div className="relative z-10">
        {/* Tab Bar */}
        <nav className="bg-[rgba(26,26,29,0.82)] glass-panel border-b border-[#C7B8FF]/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C7B8FF]/35 via-[#9F7BFF]/30 to-[#1A1A1D]/20 flex items-center justify-center border border-[#C7B8FF]/20 shadow-lg shadow-[#9F7BFF]/25">
                  <SparklesIcon className="w-5 h-5 text-[#C7B8FF]" />
                </div>
                <span className="text-2xl font-light tracking-tight text-white">
                  Style<span className="font-semibold text-[#C7B8FF]">X</span>
                </span>
              </div>
              {/* Tabs */}
              <div className="flex items-center gap-3">
                {tabs.map(tab => {
                const Icon = tab.icon;
                const showBadge = tab.id === 'saved' && savedSuggestions.length > 0;
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all soft-tilt border ${activeTab === tab.id ? 'bg-[#C7B8FF]/10 text-white border-[#C7B8FF]/50 shadow-[0_15px_45px_rgba(159,123,255,0.35)]' : 'text-slate-300 border-[#C7B8FF]/15 hover:border-[#9F7BFF]/60 hover:text-white hover:bg-white/5'}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                      {showBadge && <span className="ml-1 inline-flex items-center justify-center min-w-[24px] px-1 text-[0.65rem] font-semibold rounded-full bg-[#9F7BFF]/25 text-[#FAFAFA] border border-[#C7B8FF]/40">{savedSuggestions.length}</span>}
                    </button>;
              })}
                <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="ml-1 inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#C7B8FF]/20 text-slate-200 hover:text-[#C7B8FF] transition-colors hover:border-[#9F7BFF]/60">
                  {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
        {/* Main Content */}
        <div className="p-6 pt-8">
        {activeTab === 'discover' && <div className="flex items-center justify-center">
            <div className="max-w-3xl w-full">
              {/* Branding */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#C7B8FF] via-[#9F7BFF] to-[#7c6fe8] animate-gradient flex items-center justify-center shadow-xl shadow-[#9F7BFF]/35 gradient-border">
                    <SparklesIcon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-light tracking-tight text-white">
                    Style<span className="font-semibold text-[#C7B8FF]">X</span>
                  </span>
                </div>
                <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                  AI-powered fashion curation, tailored to your style. Clean lines, luxe gradients, effortless glow.
                </p>
              </div>
              {/* Search Box */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative bg-[rgba(26,26,29,0.78)] rounded-2xl shadow-2xl shadow-[#9F7BFF]/18 border border-[#C7B8FF]/15 overflow-hidden transition-all hover:shadow-[#9F7BFF]/30 glass-panel gradient-border soft-tilt">
                  <div className="flex items-center px-6 py-5">
                    <SearchIcon className="w-6 h-6 text-[#C7B8FF] mr-4 flex-shrink-0" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="coastal grandma aesthetic sweaters" className="flex-1 text-lg text-white placeholder-slate-500 bg-transparent border-none outline-none" />
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-gradient-to-r from-[#C7B8FF] via-[#9F7BFF] to-[#7c6fe8] hover:from-[#d6cdff] hover:via-[#b5a0ff] hover:to-[#8c7cff] text-[#1A1A1D] font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#9F7BFF]/40 hover:shadow-[#9F7BFF]/50 animate-gradient">
                  Discover Your Style
                </button>
              </form>
              {/* Suggestions */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400 mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Minimalist basics', 'Vintage denim', 'Office casual', 'Boho chic'].map(tag => <button key={tag} onClick={() => {
                  setSearchQuery(tag);
                  runSearch(tag);
                  fetchAiRecommendation(tag);
                  refreshProductSuggestions(tag);
                }} className="px-4 py-2 bg-white/5 border border-[#C7B8FF]/15 rounded-full text-sm text-slate-200 hover:border-[#9F7BFF] hover:text-white transition-colors shadow-sm shadow-[#9F7BFF]/15">
                      {tag}
                    </button>)}
                </div>
              </div>
              {hasSearched && <div className="mt-12 space-y-6">
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-2xl font-semibold text-white">
                      Curated looks for {searchQuery ? `"${searchQuery}"` : 'you'}
                    </h3>
                    <p className="text-slate-400">
                      Generated from our AI trend index and your search mood.
                    </p>
                  </div>
                  <div className="bg-[rgba(26,26,29,0.78)] border border-[#C7B8FF]/15 rounded-2xl p-6 shadow-xl shadow-[#9F7BFF]/18 glass-panel gradient-border soft-tilt">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#C7B8FF]">Lumi AI Stylist</p>
                        <h4 className="text-xl font-semibold text-white mt-1">Prompt response</h4>
                        <p className="text-sm text-slate-300">We send your vibe to our LLM for a fresh outfit briefing.</p>
                      </div>
                      {isLoadingResponse && <div className="w-8 h-8 border-2 border-[#C7B8FF] border-t-transparent rounded-full animate-spin" aria-label="Loading AI response" />}
                    </div>
                    <div className="mt-4 text-slate-200 space-y-2">
                      {aiError && <p className="text-sm text-rose-300">{aiError}</p>}
                      {formattedAiLines.length > 0 && <div className="space-y-2">
                          {formattedAiLines.map((line, index) => {
                            const isBrief = line.toLowerCase().startsWith('style brief');
                            const isLook = line.toLowerCase().startsWith('look:');
                            if (isLook) {
                              return <div key={index} className="flex items-start gap-3">
                                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C7B8FF]" />
                                  <p className="text-sm leading-relaxed text-slate-100">
                                    {line.replace(/^look:\s*/i, '')}
                                  </p>
                                </div>;
                            }
                            if (isBrief) {
                              return <p key={index} className="text-sm font-semibold text-[#C7B8FF]">
                                  {line.replace(/^style brief:\s*/i, 'Style Brief: ')}
                                </p>;
                            }
                            return <p key={index} className="text-sm leading-relaxed text-slate-200">
                                {line}
                              </p>;
                          })}
                        </div>}
                      {!aiResponse && !aiError && !isLoadingResponse && <p className="text-sm text-slate-400">
                        Enter a clothing prompt above to receive a personalized outfit brief.
                      </p>}
                  </div>
                </div>
                  {warmNeutralQueryMatch && <div className="bg-[rgba(26,26,29,0.78)] border border-[#C7B8FF]/15 rounded-2xl p-6 shadow-xl shadow-[#9F7BFF]/18 glass-panel gradient-border soft-tilt">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-[#C7B8FF]">Recommendations</p>
                          <h4 className="text-xl font-semibold text-white mt-1">Warm, neutral, professional picks</h4>
                          <p className="text-sm text-slate-300">Direct links curated for your request to keep the palette polished and cozy.</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        {WARM_NEUTRAL_RECOMMENDATIONS.map(item => <div key={item.url} className="rounded-xl border border-[#C7B8FF]/20 bg-white/5 p-4 flex items-start justify-between gap-3 soft-tilt">
                            <div className="space-y-1">
                              <a href={item.url} target="_blank" rel="noreferrer" className="text-sm sm:text-base font-semibold text-[#C7B8FF] hover:text-white transition-colors">
                                {item.title}
                              </a>
                              <p className="text-sm text-slate-300">{item.description}</p>
                            </div>
                            <Link2Icon className="w-4 h-4 text-[#C7B8FF] shrink-0" />
                          </div>)}
                      </div>
                    </div>}
                  {productSuggestions.length > 0 && <div className="bg-[rgba(26,26,29,0.78)] border border-[#C7B8FF]/15 rounded-2xl p-6 shadow-xl shadow-[#9F7BFF]/18 glass-panel gradient-border soft-tilt">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-[#C7B8FF]">MCP Shopping Agent</p>
                          <h4 className="text-xl font-semibold text-white mt-1">Live trend-matched buys</h4>
                          <p className="text-sm text-slate-300">Pulling working links based on your prompt plus today’s scraped trend signals.</p>
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                          <p>Feeds: vogue • whowhatwear • gq</p>
                          <p className="text-[0.7rem]">via jina.ai MCP proxy</p>
                        </div>
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        {productSuggestions.map(suggestion => {
                        const saved = savedSuggestions.some(item => item.id === suggestion.id);
                        return <div key={suggestion.id} className="rounded-2xl border border-[#C7B8FF]/20 bg-white/5 p-4 flex flex-col gap-3 shadow-lg shadow-[#9F7BFF]/10 soft-tilt">
                              <div className="flex items-start gap-2">
                                <div className="p-2 rounded-xl bg-[#9F7BFF]/15 border border-[#C7B8FF]/40 text-[#FAFAFA]">
                                  <Link2Icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs uppercase tracking-[0.3em] text-[#C7B8FF]">{suggestion.vibe}</p>
                                  <h5 className="text-lg font-semibold text-white leading-snug">{suggestion.title}</h5>
                                  <p className="text-xs text-slate-400">{suggestion.retailer}</p>
                                </div>
                              </div>
                              <p className="text-sm text-slate-300 flex-1">{suggestion.reason}</p>
                              <div className="flex items-center justify-between gap-2">
                                <a href={suggestion.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C7B8FF] hover:text-[#FAFAFA]">Shop link ↗</a>
                                <button type="button" onClick={() => saved ? handleRemoveSaved(suggestion.id) : handleSaveSuggestion(suggestion)} className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border ${saved ? 'border-emerald-500/40 text-emerald-200 bg-emerald-500/10' : 'border-[#C7B8FF]/30 text-slate-200 hover:border-[#9F7BFF] hover:text-white'}`}>
                                  {saved ? <><BookmarkCheckIcon className="w-3 h-3" /> Saved</> : <><BookmarkPlusIcon className="w-3 h-3" /> Save</>}
                                </button>
                              </div>
                        </div>;
                      })}
                      </div>
                    </div>}
                  {searchResults.length === 0 ? <div className="bg-[rgba(26,26,29,0.78)] border border-[#C7B8FF]/15 rounded-2xl p-8 text-center text-slate-300 glass-panel gradient-border">
                      <p className="font-medium text-lg">
                        We couldn’t find a perfect match.
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Try another prompt or pick one of the popular searches above.
                      </p>
                    </div> : <div className="grid gap-5 sm:grid-cols-2">
                      {searchResults.map(look => <div key={look.id} className="bg-[rgba(26,26,29,0.78)] border border-[#C7B8FF]/15 rounded-2xl overflow-hidden shadow-xl shadow-[#9F7BFF]/18 soft-tilt">
                          <img src={look.image} alt={look.title} className="w-full h-48 object-cover" />
                          <div className="p-5 space-y-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-[#C7B8FF] mb-1">
                                {look.vibe}
                              </p>
                              <h4 className="text-xl font-semibold text-white">
                                {look.title}
                              </h4>
                            </div>
                            <p className="text-sm text-slate-300">
                              {look.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {look.tags.map(tag => <span key={tag} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-[#C7B8FF]/25 text-slate-100">
                                  {tag}
                                </span>)}
                          </div>
                          </div>
                        </div>)}
                    </div>}
                </div>}
            </div>
          </div>}
        {activeTab === 'saved' && <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-[#9F7BFF]/18 glass-panel gradient-border">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#C7B8FF]/80">Saved links</p>
                  <h2 className="text-3xl font-light text-white">Your Lumi shopping board</h2>
                  <p className="text-slate-300">We stash the MCP agent’s live links here so you can revisit or clean them up.</p>
                </div>
                <button onClick={() => setActiveTab('discover')} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-white/10 text-slate-200 hover:border-[#9F7BFF] hover:text-white soft-tilt">
                  <SearchIcon className="w-4 h-4" />
                  New prompt
                </button>
              </div>
            </div>
            {savedSuggestions.length === 0 ? <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-8 text-center text-slate-300 shadow-lg shadow-[#9F7BFF]/18 glass-panel gradient-border">
                <p className="text-lg font-semibold text-white">No saved items yet</p>
                <p className="text-sm text-slate-400 mt-2">Run a discovery prompt and hit “Save” on a link to pin it here.</p>
                <button onClick={() => setActiveTab('discover')} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C7B8FF]/30 to-[#9F7BFF]/30 text-white font-semibold border border-white/10 hover:from-[#d6cdff]/50 hover:to-[#b5a0ff]/50 soft-tilt">
                  Jump to Discover
                </button>
              </div> : <div className="grid gap-4 sm:grid-cols-2">
                {savedSuggestions.map(item => <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 shadow-lg shadow-blue-900/25 soft-tilt">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#9F7BFF]/15 border border-[#C7B8FF]/40 text-[#EADFE9]">
                        <BookmarkCheckIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#C7B8FF]/80">{item.vibe}</p>
                        <h4 className="text-lg font-semibold text-white leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-400">{item.retailer}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 flex-1">{item.reason}</p>
                    <div className="flex items-center justify-between gap-2">
                      <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C7B8FF] hover:text-[#EADFE9]">
                        <Link2Icon className="w-4 h-4" />
                        Shop link
                      </a>
                      <button type="button" onClick={() => handleRemoveSaved(item.id)} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-slate-200 hover:border-rose-400 hover:text-rose-100">
                        Remove
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>}
        {activeTab === 'trending' && <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-[#9F7BFF]/18 glass-panel gradient-border">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#C7B8FF]/80">Live Trend Signals</p>
                  <h2 className="text-3xl sm:text-4xl font-light text-white">
                    Trend Briefing: 3 Story Bullets • 5 Outfits Each
                  </h2>
                  <p className="text-slate-300">
                    We scrape Vogue, Who What Wear, and GQ headlines via the MCP-friendly jina.ai proxy, then auto-cluster
                    the signals into shoppable outfit briefs.
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-3 min-w-[200px]">
                  <div className="text-sm text-slate-400">
                    {trendLastUpdated ? <>Last sync <span className="text-white font-medium">
                          {trendLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        </> : 'Waiting for live scrape...'}
                  </div>
                  <button onClick={loadTrends} disabled={isLoadingTrends} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#C7B8FF]/50 text-sm font-semibold text-white bg-gradient-to-r from-[#C7B8FF]/25 to-[#9F7BFF]/20 hover:from-[#C7B8FF]/35 hover:to-[#9F7BFF]/30 disabled:opacity-60 disabled:cursor-not-allowed soft-tilt">
                    {isLoadingTrends && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    Refresh feed
                  </button>
                </div>
              </div>
              {trendError && <div className="mt-4 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3">
                  {trendError}
                </div>}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {trendingClusters.map((cluster, index) => <article key={cluster.id} className="bg-slate-950/70 border border-white/10 rounded-3xl p-6 flex flex-col gap-5 shadow-xl shadow-blue-900/25 soft-tilt glass-panel gradient-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#9F7BFF]/15 border border-[#C7B8FF]/30 text-[#C7B8FF] font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C7B8FF]/70 mb-1">Trend Story</p>
                      <h3 className="text-xl font-semibold text-white">
                        {cluster.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    {cluster.summary}
                  </p>
                  <ul className="space-y-3">
                    {cluster.examples.map(example => <li key={`${cluster.id}-${example.title}`} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white leading-tight">
                              {example.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {example.excerpt}
                            </p>
                          </div>
                          <a href={example.link} target="_blank" rel="noreferrer" className="text-xs text-[#C7B8FF] hover:text-[#C7B8FF] font-semibold whitespace-nowrap">
                            Source ↗
                          </a>
                        </div>
                        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                          {example.source}
                        </p>
                      </li>)}
                  </ul>
                </article>)}
            </div>
            <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 glass-panel gradient-border">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#C7B8FF]/70">MCP Source Monitor</p>
                  <h4 className="text-lg font-semibold text-white">Live scraping health</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Proxy: <span className="text-white font-medium">r.jina.ai</span> for CORS-safe fetches
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trendSourcesStatus.map(source => <div key={source.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 soft-tilt">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${source.status === 'ok' ? 'bg-emerald-400' : source.status === 'error' ? 'bg-rose-400' : 'bg-amber-300 animate-pulse'}`} />
                      <p className="text-sm font-medium text-white">
                        {source.label}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {source.status === 'ok' ? `${source.items.length} headlines parsed` : source.status === 'error' ? source.error ?? 'Feed unavailable' : 'Fetching latest headlines...'}
                    </p>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-[#C7B8FF] hover:text-[#EADFE9] font-semibold">
                      View feed ↗
                    </a>
                  </div>)}
              </div>
            </div>
          </div>}
        {activeTab === 'try-on' && <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-white mb-2">
                  Virtual Try-On
                </h2>
                <p className="text-slate-300">
                  Upload your photo and see how different outfits look on you
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Upload & Select */}
                <div className="space-y-6">
                  <input ref={selfieUploadInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  <input ref={selfieCaptureInputRef} type="file" className="hidden" accept="image/*" capture="user" onChange={handlePhotoUpload} />
                  <input ref={outfitUploadInputRef} type="file" className="hidden" accept="image/*" onChange={handleOutfitUpload} />
                  <input ref={outfitCaptureInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleOutfitUpload} />
                  {/* Upload Photo */}
                  <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-[#9F7BFF]/18 border border-white/10 p-6 space-y-4 glass-panel gradient-border soft-tilt">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          1. Upload Your Photo
                        </h3>
                        <p className="text-xs text-slate-400">Upload or take a quick snap from your camera.</p>
                      </div>
                      {userPhoto && <button onClick={() => setUserPhoto(null)} className="text-xs px-3 py-1 rounded-lg border border-white/10 text-slate-200 hover:border-[#9F7BFF] hover:text-white">
                          Change
                        </button>}
                    </div>
                    {!userPhoto ? <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button type="button" onClick={triggerSelfieUpload} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-[#9F7BFF]/70 hover:text-white">
                            <UploadIcon className="w-4 h-4" />
                            Upload from library
                          </button>
                          <button type="button" onClick={triggerSelfieCapture} disabled={isCapturingSelfie} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-[#9F7BFF]/70 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed">
                            {isCapturingSelfie ? <span className="w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                            {isCapturingSelfie ? 'Opening camera...' : 'Take a photo'}
                          </button>
                        </div>
                        <div onClick={triggerSelfieUpload} className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#9F7BFF] transition-colors bg-white/5">
                          <UploadIcon className="w-12 h-12 text-slate-400 mb-3" />
                          <span className="text-sm text-slate-300">
                            Drop a selfie or tap to upload
                          </span>
                        </div>
                      </div> : <div className="relative">
                        <img src={userPhoto} alt="Your photo" className="w-full h-64 object-cover rounded-xl" />
                        <p className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white">
                          Person reference
                        </p>
                      </div>}
                  </div>
                  {/* Select Outfit */}
                  <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-[#9F7BFF]/18 border border-white/10 p-6 space-y-4 glass-panel gradient-border soft-tilt">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          2. Select an Outfit
                        </h3>
                        <p className="text-xs text-slate-400">Choose a sample or upload a photo of your own look.</p>
                      </div>
                      {customOutfitImage && <button onClick={() => {
                    setCustomOutfitImage(null);
                    setSelectedOutfit(null);
                  }} className="text-xs px-3 py-1 rounded-lg border border-white/10 text-slate-200 hover:border-[#9F7BFF] hover:text-white">
                          Clear
                        </button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {mockOutfits.map(outfit => <button key={outfit.id} onClick={() => setSelectedOutfit(outfit.id)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedOutfit === outfit.id ? 'border-[#C7B8FF] shadow-lg shadow-[#9F7BFF]/30' : 'border-white/10 hover:border-[#9F7BFF]/70'} bg-white/5`}>
                          <img src={outfit.image} alt={outfit.name} className="w-full h-32 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs font-medium">
                              {outfit.name}
                            </p>
                          </div>
                          {selectedOutfit === outfit.id && <div className="absolute top-2 right-2 bg-[#9F7BFF] rounded-full p-1">
                              <SparklesIcon className="w-4 h-4 text-white" />
                            </div>}
                        </button>)}
                    </div>
                    <div className="border border-dashed border-white/10 rounded-xl p-4 bg-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Upload your outfit</p>
                          <p className="text-xs text-slate-400">Use a mirror pic or flat lay to test fit.</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={triggerOutfitUpload} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:border-[#9F7BFF]/70 hover:text-white">
                            <UploadIcon className="w-3 h-3" />
                            Upload
                          </button>
                          <button type="button" onClick={triggerOutfitCapture} disabled={isCapturingOutfit} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:border-[#9F7BFF]/70 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed">
                            {isCapturingOutfit ? <span className="w-3 h-3 border border-slate-200 border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                            {isCapturingOutfit ? 'Opening camera...' : 'Take photo'}
                          </button>
                        </div>
                      </div>
                      {!customOutfitImage ? <div onClick={triggerOutfitUpload} className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#9F7BFF] transition-colors bg-white/5">
                          <span className="text-sm text-slate-300">Drop or tap to add your outfit</span>
                        </div> : <div className="relative">
                          <img src={customOutfitImage} alt="Uploaded outfit" className="w-full h-40 object-cover rounded-xl" />
                          <p className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-white">
                            Outfit reference
                          </p>
                        </div>}
                    </div>
                  </div>
                  {/* Generate Button */}
                  <button onClick={handleGenerate} disabled={!userPhoto || !selectedOutfitImage || isGenerating} className="w-full bg-gradient-to-r from-[#C7B8FF] via-[#9F7BFF] to-[#7c6fe8] hover:from-[#d6cdff] hover:via-[#b5a0ff] hover:to-[#8c7cff] disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-[#1A1A1D] font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-[#9F7BFF]/40 hover:shadow-[#9F7BFF]/50 flex items-center justify-center gap-2 animate-gradient">
                    {isGenerating ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </> : <>
                        <WandIcon className="w-5 h-5" />
                        Generate Try-On
                      </>}
                  </button>
                  {tryOnError && <p className="text-sm text-rose-300">{tryOnError}</p>}
                </div>
                {/* Right Column - Result */}
                <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-[#9F7BFF]/18 border border-white/10 p-6 glass-panel gradient-border soft-tilt">
                  <h3 className="text-lg font-medium text-white mb-4">
                    3. Your Virtual Try-On
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    We blend your selfie with the outfit image to render an AI try-on preview tailored to you.
                  </p>
                  {!generatedImage ? <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                      <ImageIcon className="w-16 h-16 text-slate-500 mb-3" />
                      <p className="text-slate-400 text-center px-6">
                        Your generated image will appear here
                      </p>
                    </div> : <div className="space-y-4">
                      <img src={generatedImage} alt="Generated try-on" className="w-full h-96 object-cover rounded-xl" />
                      <div className="flex gap-2">
                        <button className="flex-1 bg-slate-900/70 hover:bg-slate-800 text-slate-200 font-medium py-3 px-4 rounded-lg transition-colors">
                          Save
                        </button>
                        <button className="flex-1 bg-[#9F7BFF]/20 hover:bg-[#9F7BFF]/25 text-[#C7B8FF] font-medium py-3 px-4 rounded-lg transition-colors">
                          Share
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>;
  }

