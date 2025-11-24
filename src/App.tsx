import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon, SparklesIcon, HomeIcon, HeartIcon, FolderIcon, UserIcon, TrendingUpIcon, ImageIcon, UploadIcon, WandIcon, SunIcon, MoonIcon } from 'lucide-react';

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

type TrendSourceStatus = {
  id: string;
  label: string;
  url: string;
  status: 'idle' | 'loading' | 'ok' | 'error';
  items: TrendExample[];
  error?: string;
};

const styleRecommendations: StyleRecommendation[] = [{
  id: 1,
  title: 'Coastal Layers',
  vibe: 'Coastal grandma, relaxed chic',
  description: 'Airy linens, muted blues and creamy knits for breezy evenings by the water.',
  image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600',
  tags: ['coastal', 'grandma', 'linen', 'relaxed']
}, {
  id: 2,
  title: 'Minimalist Capsule',
  vibe: 'Tailored, modern, monochrome',
  description: 'Structured tailoring paired with premium basics in charcoal and ivory.',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
  tags: ['minimalist', 'office', 'capsule', 'modern']
}, {
  id: 3,
  title: 'Boho Market Day',
  vibe: 'Free-spirited layers',
  description: 'Printed maxi dress, woven tote and artisan jewelry for an effortless weekend.',
  image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&sat=-50',
  tags: ['boho', 'market', 'weekend', 'prints']
}, {
  id: 4,
  title: 'Streetwear Edge',
  vibe: 'Sporty, bold, graphic',
  description: 'Statement bomber, relaxed denim and chunky sneakers for city energy.',
  image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&hue=10',
  tags: ['urban', 'street', 'bold', 'denim']
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
  id: 'calm-coastal',
  title: 'Sunlit Coastal Ease',
  summary: 'Soft tailoring, raffia textures, and watery blues deliver the runaway “quiet vacation” brief. Layer breezy knits over swimwear and anchor with artisan accessories.',
  examples: [{
    title: 'Ivory crochet set with cloud-blue poplin shirt',
    source: 'In-house Trend Desk',
    excerpt: 'Blend loose crochet with structured shirting and metallic slides for a jet-set breakfast look.',
    link: 'https://stylex.ai/trends/coastal-ease'
  }, {
    title: 'Sandy linen maxi and raffia fisherman sandals',
    source: 'In-house Trend Desk',
    excerpt: 'Elevate the neutral column dress with leather cuffs and a split-hem linen blazer.',
    link: 'https://stylex.ai/trends/coastal-ease'
  }, {
    title: 'Oversized butter yellow cardigan with silk shorts',
    source: 'In-house Trend Desk',
    excerpt: 'Let a fluid camisole and delicate gold chains keep the palette light and luminous.',
    link: 'https://stylex.ai/trends/coastal-ease'
  }, {
    title: 'Aqua slip dress with netted tote and pearls',
    source: 'In-house Trend Desk',
    excerpt: 'Finish with shell-inspired earrings and slicked-back hair for seaside dinners.',
    link: 'https://stylex.ai/trends/coastal-ease'
  }, {
    title: 'Striped rugby knit over white denim shorts',
    source: 'In-house Trend Desk',
    excerpt: 'Pop on a silk scarf and fisherman cap to nail nostalgic yacht club energy.',
    link: 'https://stylex.ai/trends/coastal-ease'
  }]
}, {
  id: 'utility-glam',
  title: 'Utility Sport Luxe',
  summary: 'Cargo tailoring, silver hardware, and mesh inserts transform practical staples into statement outfits fit for the city commute and gallery hop.',
  examples: [{
    title: 'Charcoal parachute pants with sculpted corset tank',
    source: 'In-house Trend Desk',
    excerpt: 'Add mirrored sunnies and sleek trainers to keep proportions sharp.',
    link: 'https://stylex.ai/trends/utility-luxe'
  }, {
    title: 'Olive nylon blazer over racer bodysuit',
    source: 'In-house Trend Desk',
    excerpt: 'Layer on a webbed belt and sling bag for a polished utilitarian finish.',
    link: 'https://stylex.ai/trends/utility-luxe'
  }, {
    title: 'Sculpted denim midi skirt with moto boots',
    source: 'In-house Trend Desk',
    excerpt: 'Balance with a mesh mock neck and boxy bomber for off-duty editors.',
    link: 'https://stylex.ai/trends/utility-luxe'
  }, {
    title: 'Silver windbreaker with pleated tennis skirt',
    source: 'In-house Trend Desk',
    excerpt: 'Ground the metallic sheen with retro tube socks and chalky sneakers.',
    link: 'https://stylex.ai/trends/utility-luxe'
  }, {
    title: 'Cropped cargo vest over satin slip',
    source: 'In-house Trend Desk',
    excerpt: 'Finish the high-low mix with rope sandals and sculptural cuffs.',
    link: 'https://stylex.ai/trends/utility-luxe'
  }]
}, {
  id: 'club-neo',
  title: 'After-Dark Neo Glam',
  summary: 'Liquid shine, dramatic draping, and futuristic accessories dominate party dressing as seen across runways and IG moodboards.',
  examples: [{
    title: 'Graphite sequin column dress with sporty bomber',
    source: 'In-house Trend Desk',
    excerpt: 'Contrast sparkle with matte nylon layers and sculptural hoops.',
    link: 'https://stylex.ai/trends/neo-glam'
  }, {
    title: 'Ruby mesh top with leather midi and slingbacks',
    source: 'In-house Trend Desk',
    excerpt: 'Stack anklets and micro bags for saturated cocktail energy.',
    link: 'https://stylex.ai/trends/neo-glam'
  }, {
    title: 'Liquid metal mini with moto gloves',
    source: 'In-house Trend Desk',
    excerpt: 'Pair with chrome eye shadow and razor-sharp bob for Y2K futurism.',
    link: 'https://stylex.ai/trends/neo-glam'
  }, {
    title: 'Black sheer set layered over bike shorts',
    source: 'In-house Trend Desk',
    excerpt: 'Temper the transparency with heavy chain belts and kitten heels.',
    link: 'https://stylex.ai/trends/neo-glam'
  }, {
    title: 'Draped satin blouse with puddle pants',
    source: 'In-house Trend Desk',
    excerpt: 'Cinch with a jeweled waist belt and metallic clutch.',
    link: 'https://stylex.ai/trends/neo-glam'
  }]
}];

const STOP_WORDS = new Set(['with', 'from', 'that', 'this', 'your', 'into', 'their', 'about', 'after', 'these', 'those', 'while', 'where', 'which', 'style', 'trend', 'looks', 'fashion', 'season']);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&amp;|&#39;|&quot;/g, ' ').replace(/\s+/g, ' ').trim();

type Theme = 'dark' | 'light';
const THEME_STORAGE_KEY = 'stylex-theme';
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
  const [trendingClusters, setTrendingClusters] = useState<TrendCluster[]>(FALLBACK_TRENDS);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendError, setTrendError] = useState<string | null>(null);
  const [trendSourcesStatus, setTrendSourcesStatus] = useState<TrendSourceStatus[]>(TREND_SOURCES.map(source => ({
    ...source,
    status: 'idle',
    items: []
  })));
  const [trendLastUpdated, setTrendLastUpdated] = useState<Date | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const preferred = getPreferredTheme();
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = preferred;
    }
    return preferred;
  });
  const selfieUploadInputRef = useRef<HTMLInputElement | null>(null);
  const selfieCaptureInputRef = useRef<HTMLInputElement | null>(null);
  const outfitUploadInputRef = useRef<HTMLInputElement | null>(null);
  const outfitCaptureInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowRipple(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
    const track = stream.getVideoTracks()[0];
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
          setTrendError('Supplemented live scrape with StyleX archive to complete three stories.');
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
    name: 'Coastal Grandma Set',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'
  }, {
    id: 2,
    name: 'Minimalist Chic',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'
  }, {
    id: 3,
    name: 'Boho Vibes',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'
  }, {
    id: 4,
    name: 'Urban Street Style',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
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
    } else {
      setAiResponse(null);
      setAiError(null);
    }
  };
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
  return <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      {showRipple && <div className="gradient-ripple absolute inset-0" />}
      <div className="relative z-10">
        {/* Tab Bar */}
        <nav className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-300" />
                <span className="text-2xl font-light tracking-tight text-white">
                  Style<span className="font-semibold text-cyan-300">X</span>
                </span>
              </div>
              {/* Tabs */}
              <div className="flex items-center gap-3">
                {tabs.map(tab => {
                const Icon = tab.icon;
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-200 border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'text-slate-400 border-transparent hover:border-slate-700 hover:bg-slate-900/60'}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>;
              })}
                <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="ml-1 inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 text-slate-200 hover:text-cyan-300 transition-colors">
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
                  <SparklesIcon className="w-10 h-10 text-cyan-300" />
                  <span className="text-5xl font-light tracking-tight text-white">
                    Style<span className="font-semibold text-cyan-300">X</span>
                  </span>
                </div>
                <p className="text-lg text-slate-300 font-light">
                  AI-powered fashion curation, tailored to your style
                </p>
              </div>
              {/* Search Box */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative bg-slate-950/70 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 overflow-hidden transition-all hover:shadow-cyan-500/20">
                  <div className="flex items-center px-6 py-5">
                    <SearchIcon className="w-6 h-6 text-slate-400 mr-4 flex-shrink-0" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="coastal grandma aesthetic sweaters" className="flex-1 text-lg text-white placeholder-slate-500 bg-transparent border-none outline-none" />
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40">
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
                }} className="px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-full text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-200 transition-colors">
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
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-cyan-500/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">StyleX AI Stylist</p>
                        <h4 className="text-xl font-semibold text-white mt-1">Prompt response</h4>
                        <p className="text-sm text-slate-400">We send your vibe to our LLM for a fresh outfit briefing.</p>
                      </div>
                      {isLoadingResponse && <div className="w-8 h-8 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" aria-label="Loading AI response" />}
                    </div>
                    <div className="mt-4 text-slate-200 space-y-2">
                      {aiError && <p className="text-sm text-rose-300">{aiError}</p>}
                      {aiResponse && aiResponse.split('\n').map((line, index) => <p key={index} className="text-sm leading-relaxed text-slate-200">
                            {line}
                          </p>)}
                      {!aiResponse && !aiError && !isLoadingResponse && <p className="text-sm text-slate-400">
                          Enter a clothing prompt above to receive a personalized outfit brief.
                        </p>}
                    </div>
                  </div>
                  {searchResults.length === 0 ? <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-300">
                      <p className="font-medium text-lg">
                        We couldn’t find a perfect match.
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Try another prompt or pick one of the popular searches above.
                      </p>
                    </div> : <div className="grid gap-5 sm:grid-cols-2">
                      {searchResults.map(look => <div key={look.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/5">
                          <img src={look.image} alt={look.title} className="w-full h-48 object-cover" />
                          <div className="p-5 space-y-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80 mb-1">
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
                              {look.tags.map(tag => <span key={tag} className="px-3 py-1 text-xs rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                                  {tag}
                                </span>)}
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </div>}
            </div>
          </div>}
        {activeTab === 'trending' && <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Live Trend Signals</p>
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
                  <button onClick={loadTrends} disabled={isLoadingTrends} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/50 text-sm font-semibold text-white bg-cyan-500/10 hover:bg-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
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
              {trendingClusters.map((cluster, index) => <article key={cluster.id} className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 shadow-xl shadow-blue-900/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-cyan-300/70 mb-1">Trend Story</p>
                      <h3 className="text-xl font-semibold text-white">
                        {cluster.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    {cluster.summary}
                  </p>
                  <ul className="space-y-3">
                    {cluster.examples.map(example => <li key={`${cluster.id}-${example.title}`} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-white leading-tight">
                              {example.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {example.excerpt}
                            </p>
                          </div>
                          <a href={example.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold whitespace-nowrap">
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
            <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">MCP Source Monitor</p>
                  <h4 className="text-lg font-semibold text-white">Live scraping health</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Proxy: <span className="text-white font-medium">r.jina.ai</span> for CORS-safe fetches
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trendSourcesStatus.map(source => <div key={source.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${source.status === 'ok' ? 'bg-emerald-400' : source.status === 'error' ? 'bg-rose-400' : 'bg-amber-300 animate-pulse'}`} />
                      <p className="text-sm font-medium text-white">
                        {source.label}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {source.status === 'ok' ? `${source.items.length} headlines parsed` : source.status === 'error' ? source.error ?? 'Feed unavailable' : 'Fetching latest headlines...'}
                    </p>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:text-cyan-100 font-semibold">
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
                  <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          1. Upload Your Photo
                        </h3>
                        <p className="text-xs text-slate-400">Upload or take a quick snap from your camera.</p>
                      </div>
                      {userPhoto && <button onClick={() => setUserPhoto(null)} className="text-xs px-3 py-1 rounded-lg border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-200">
                          Change
                        </button>}
                    </div>
                    {!userPhoto ? <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button type="button" onClick={triggerSelfieUpload} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100">
                            <UploadIcon className="w-4 h-4" />
                            Upload from library
                          </button>
                          <button type="button" onClick={triggerSelfieCapture} disabled={isCapturingSelfie} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isCapturingSelfie ? <span className="w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                            {isCapturingSelfie ? 'Opening camera...' : 'Take a photo'}
                          </button>
                        </div>
                        <div onClick={triggerSelfieUpload} className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors bg-slate-900/40">
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
                  <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 p-6 space-y-4">
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
                  }} className="text-xs px-3 py-1 rounded-lg border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-200">
                          Clear
                        </button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {mockOutfits.map(outfit => <button key={outfit.id} onClick={() => setSelectedOutfit(outfit.id)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedOutfit === outfit.id ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' : 'border-slate-800 hover:border-cyan-400/70'}`}>
                          <img src={outfit.image} alt={outfit.name} className="w-full h-32 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs font-medium">
                              {outfit.name}
                            </p>
                          </div>
                          {selectedOutfit === outfit.id && <div className="absolute top-2 right-2 bg-cyan-400 rounded-full p-1">
                              <SparklesIcon className="w-4 h-4 text-white" />
                            </div>}
                        </button>)}
                    </div>
                    <div className="border border-dashed border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Upload your outfit</p>
                          <p className="text-xs text-slate-400">Use a mirror pic or flat lay to test fit.</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={triggerOutfitUpload} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100">
                            <UploadIcon className="w-3 h-3" />
                            Upload
                          </button>
                          <button type="button" onClick={triggerOutfitCapture} disabled={isCapturingOutfit} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isCapturingOutfit ? <span className="w-3 h-3 border border-slate-200 border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                            {isCapturingOutfit ? 'Opening camera...' : 'Take photo'}
                          </button>
                        </div>
                      </div>
                      {!customOutfitImage ? <div onClick={triggerOutfitUpload} className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors bg-slate-950/40">
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
                  <button onClick={handleGenerate} disabled={!userPhoto || !selectedOutfitImage || isGenerating} className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-950 font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 flex items-center justify-center gap-2">
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
                <div className="bg-slate-950/60 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    3. Your Virtual Try-On
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    We blend your selfie with the outfit image to render an AI try-on preview tailored to you.
                  </p>
                  {!generatedImage ? <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/40">
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
                        <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-medium py-3 px-4 rounded-lg transition-colors">
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

