import React, { useEffect, useMemo, useState } from 'react';
import { Loader2Icon } from 'lucide-react';

type Product = {
  id: string;
  title: string;
  retailer: string;
  url: string;
  description: string;
  keywords: string[];
  swatch: string;
};

const productLibrary: Product[] = [
  {
    id: 'linen-color-trouser',
    title: 'Mineral check linen cotton trousers',
    retailer: 'Toast',
    url: 'https://us.toa.st/products/mineral-check-linen-cotton-trousers-brown-ochre-dark-cornflower?utm_source=google&utm_medium=cpc&utm_campaign=23081248688&gad_source=1&gad_campaignid=23081248688&gbraid=0AAAAAC_4dc4SCPg_xWF-wGBBnlVCXUHOF&gclid=CjwKCAiA3L_JBhAlEiwAlcWO5-55xyLUTC_lxYOixVl6GIFuLF0ShGc208jUY2pvXbL84mQTPgomUxoCh9kQAvD_BwE&gclsrc=aw.ds',
    description: 'Relaxed linen-cotton checks that bring color while staying breathable.',
    keywords: ['colorful', 'pants', 'comfy', 'linen', 'trouser'],
    swatch: 'from-amber-200 to-blue-200'
  },
  {
    id: 'velvet-flare',
    title: 'Cali velvet flare pant',
    retailer: 'Natural Life',
    url: 'https://www.naturallife.com/products/cali-velvet-flare-pant-drawn-garden-wine?utm_source=google&utm_medium=cpc&utm_campaign=NLE_US_pMax_2503_Skirt_Pants&utm_id=CjwKCAiA3L_JBhAlEiwAlcWO58xQN9R6lK2BMbVFGOJpQc0QYHMc_69v_jfM6aNbG8OQJhSV0NtNfhoC2_kQAvD_BwE&utm_term=&utm_content=&gad_source=1&gad_campaignid=22337572528&gbraid=0AAAAADtW_OZf-hm_rNdIzyOSkdqiiyKII&gclid=CjwKCAiA3L_JBhAlEiwAlcWO58xQN9R6lK2BMbVFGOJpQc0QYHMc_69v_jfM6aNbG8OQJhSV0NtNfhoC2_kQAvD_BwE',
    description: 'Playful velvet flares with floral color that still feel loungey.',
    keywords: ['colorful', 'pants', 'comfy', 'velvet', 'flare'],
    swatch: 'from-rose-200 to-amber-300'
  },
  {
    id: 'canvas-low-rise',
    title: 'BDG Kayla cotton canvas low-rise pant',
    retailer: 'Urban Outfitters',
    url: 'https://www.urbanoutfitters.com/shop/hybrid/bdg-kayla-cotton-canvas-low-rise-pant?color=060&size=26&type=STANDARD&creative=&device=c&g_acctid=312-727-9506&g_adgroupid=&g_adid=&g_adtype=none&g_campaign=%5BNB+PLA+US%5D+-+PMAX+-+Womens+-+LIA&g_campaignid=20365074713&g_keyword=&g_keywordid=&g_network=x&g_type=shopping&matchtype=&network=x&utm_campaign=%5BNB+PLA+US%5D+-+PMAX+-+Womens+-+LIA&utm_content=&utm_kxconfid=vx6q4l3b6&utm_medium=cpc&utm_source=google&utm_term=&gad_source=1&gad_campaignid=20360233368&gbraid=0AAAAADpxK_82k9g9leoSl-Hq51wohVUuu&gclid=CjwKCAiA3L_JBhAlEiwAlcWO59UwdR2A-7GIryjZGq8WMQQaCj1MkXebopZcV8x0mgX4pC6xMgUpBRoCPkcQAvD_BwE&gclsrc=aw.ds',
    description: 'Canvas pants with color blocking that stay soft enough for daily wear.',
    keywords: ['colorful', 'pants', 'comfy', 'canvas', 'low-rise'],
    swatch: 'from-sky-200 to-emerald-200'
  },
  {
    id: 'warm-blazer',
    title: 'Heathered knit blazer',
    retailer: 'Quince',
    url: 'https://www.quince.com/women/knit-blazer?color=heather-brown&size=m&g_network=g&g_productchannel=online&g_adid=779198644932&g_acctid=978-058-8398&g_keyword=&g_adtype=pla&g_keywordid=pla-2446653818840&g_ifcreative=&g_adgroupid=185687838134&g_productid=43441696178346&g_merchantid=128669708&g_partition=2446653818840&g_campaignid=23131244559&g_ifproduct=product&g_campaign=&utm_source=google&utm_medium=paid_search&utm_campaign=&utm_term=43441696178346&gad_source=1&gad_campaignid=23131244559&gbraid=0AAAAAC4ZeNYDl3zNTc9E1KEmiX0DCN6Zb&gclid=CjwKCAiA3L_JBhAlEiwAlcWO564DGSaYjcfqMTIemtYK-3KQ1wcKSF5Qop3b_GYbBkMyRjQVUCkS9RoCaPwQAvD_BwE',
    description: 'A knit blazer that reads polished but feels like a soft cardigan for chilly offices.',
    keywords: ['warm', 'professional', 'office', 'blazer', 'layering'],
    swatch: 'from-amber-200 to-rose-200'
  },
  {
    id: 'wool-topcoat',
    title: 'Italian wool-blend topcoat',
    retailer: 'Banana Republic Factory',
    url: 'https://bananarepublicfactory.gapfactory.com/browse/product.do?pid=843060001&vid=1&tid=bfpl000040&kwid=1&ap=7&ds_agid=22661541960-180928168956&gad_source=1&gad_campaignid=22661541960&gbraid=0AAAAAD_AT8uhxpX1NuAX8f44boOfjZoI5&gclid=CjwKCAiA3L_JBhAlEiwAlcWO5yV8cjJsZj_fjU_Le39GwWpgSfNs7xBk3hGGNnAso18AbTnc6ussERoCaK4QAvD_BwE&gclsrc=aw.ds',
    description: 'Structured wool layer that keeps you warm while keeping silhouettes sleek.',
    keywords: ['warm', 'professional', 'coat', 'outerwear', 'tailored'],
    swatch: 'from-slate-300 to-indigo-200'
  },
  {
    id: 'ribbed-turtleneck',
    title: 'Ribbed mock-neck sweater',
    retailer: 'Everlane',
    url: 'https://www.everlane.com/products/womens-rib-knit-mockneck-sweater-heathered-sand',
    description: 'Lightweight warmth that layers smoothly under blazers without bulk.',
    keywords: ['warm', 'cozy', 'minimal', 'office', 'layering'],
    swatch: 'from-amber-100 to-amber-300'
  },
  {
    id: 'tailored-trouser',
    title: 'Pleated trouser in cool brown',
    retailer: 'Aritzia',
    url: 'https://www.aritzia.com/us/en/product/the-effortless-pant/98721.html',
    description: 'Soft drape with sharp pleats for an elevated professional base.',
    keywords: ['professional', 'tailored', 'minimal', 'trouser'],
    swatch: 'from-amber-300 to-orange-200'
  },
  {
    id: 'tech-shell',
    title: 'Waterproof shell jacket',
    retailer: 'Arc\'teryx',
    url: 'https://www.arcteryx.com/us/en/shop/womens/beta-jacket',
    description: 'A sleek protective layer for commutes or rainy days with a technical edge.',
    keywords: ['techwear', 'commute', 'rain', 'minimal', 'utility'],
    swatch: 'from-cyan-200 to-blue-300'
  },
  {
    id: 'mesh-flat',
    title: 'Mesh ballet flats',
    retailer: 'Vagabond',
    url: 'https://vagabond.com/us/lettie-5736-101-20',
    description: 'Breathable flats that pair with trousers for a softer professional finish.',
    keywords: ['minimal', 'professional', 'balletcore', 'lightweight'],
    swatch: 'from-rose-200 to-pink-300'
  },
  {
    id: 'polo-dress',
    title: 'Varsity polo mini dress',
    retailer: 'Nike',
    url: 'https://www.nike.com/t/dri-fit-adv-ace-polo-dress-1gTWP6/DV2898-010',
    description: 'Sport-inspired dress for casual, warm-weather prompts with clean lines.',
    keywords: ['sporty', 'summer', 'casual', 'minimal'],
    swatch: 'from-emerald-200 to-teal-200'
  },
  {
    id: 'denim-barrel',
    title: 'Barrel leg denim',
    retailer: 'Everlane',
    url: 'https://www.everlane.com/products/womens-barrel-pant-ankle-vintage-indigo',
    description: 'Sculptural denim to offset soft knits or oversized tailoring.',
    keywords: ['denim', 'casual', 'directional', 'street'],
    swatch: 'from-indigo-200 to-sky-200'
  }
];

const samplePrompts = [
  'Warm but professional',
  'Soft minimal weekend',
  'Sporty commute layers',
  'Night-out with metallics'
];

const normalizeAiResponse = (value: string) => {
  const lines = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return lines.map(line => line.replace(/^[-•\d.)\s]+/, ''));
};

const buildProductMatches = (prompt: string) => {
  const words = prompt.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (!words.length) return productLibrary.slice(0, 3);

  const scored = productLibrary
    .map(item => {
      const score = item.keywords.reduce((total, keyword) => total + (words.includes(keyword.toLowerCase()) ? 2 : 0), 0);
      const partial = item.keywords.reduce((total, keyword) => total + (words.some(word => keyword.includes(word)) ? 1 : 0), 0);
      return { item, score: score + partial };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));

  const meaningful = scored.filter(entry => entry.score > 0).map(entry => entry.item).slice(0, 3);
  if (meaningful.length >= 3) return meaningful;
  return [...meaningful, ...productLibrary].slice(0, 3);
};

export function App() {
  const [prompt, setPrompt] = useState('');
  const [aiCopy, setAiCopy] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowcaseLoading, setIsShowcaseLoading] = useState(false);
  const [showcase, setShowcase] = useState<Product[]>([]);
  const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(null);

  const aiLines = useMemo(() => (aiCopy ? normalizeAiResponse(aiCopy) : []), [aiCopy]);

  useEffect(() => {
    const query = submittedPrompt?.trim() || '';
    if (!query) {
      setShowcase([]);
      setIsShowcaseLoading(false);
      return;
    }

    setIsShowcaseLoading(true);
    const timeout = setTimeout(() => {
      setShowcase(buildProductMatches(query));
      setIsShowcaseLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [submittedPrompt]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const query = prompt.trim();
    if (!query) {
      setAiCopy(null);
      setAiError('Describe how you want to dress and I will draft a mini brief.');
      return;
    }

    setIsLoading(true);
    setAiError(null);
    setSubmittedPrompt(query);
    setIsShowcaseLoading(true);
    setShowcase([]);

    try {
      const response = await fetch('/api/generate-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await response.json();
      if (!response.ok || typeof data?.response !== 'string') {
        throw new Error(data?.error || 'Unable to generate response');
      }
      setAiCopy(data.response);
    } catch (error) {
      console.error('Failed to fetch AI recommendation', error);
      setAiError('Could not reach the stylist right now. Try again in a few seconds.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-6 py-20 space-y-16">

        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-neutral-400">Lumi</p>
          <h1 className="text-3xl font-medium leading-snug">A calmer way to brief your next outfit</h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Describe your vibe. Get a styling direction and shoppable picks.
          </p>
        </header>

        {/* Input */}
        <section>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Warm but professional with a hint of ease"
                className="flex-1 h-11 border border-neutral-200 rounded-lg px-4 text-sm bg-white focus:outline-none focus:border-neutral-400 placeholder:text-neutral-300"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-lg bg-[#0a0a0a] text-white text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                {isLoading
                  ? <Loader2Icon className="h-4 w-4 animate-spin" />
                  : 'Generate'
                }
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {samplePrompts.map(example => (
                <button
                  key={example}
                  type="button"
                  className="px-3 py-1 text-xs rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </button>
              ))}
            </div>

            {aiError && <p className="text-xs text-red-500">{aiError}</p>}
          </form>
        </section>

        {/* Brief */}
        {(isLoading || aiLines.length > 0) && (
          <section className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-neutral-400">Stylist brief</p>
            {isLoading ? (
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </div>
            ) : (
              <ul className="space-y-2">
                {aiLines.map((line, idx) => (
                  <li key={idx} className="text-sm text-neutral-700 leading-relaxed border-l-2 border-neutral-200 pl-3">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Products */}
        {(isShowcaseLoading || showcase.length > 0) && (
          <section className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-neutral-400">Picks</p>
            {isShowcaseLoading ? (
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                Curating...
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {showcase.map(product => (
                  <li key={product.id}>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-4 py-4 group"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium group-hover:underline underline-offset-2">{product.title}</p>
                        <p className="text-xs text-neutral-400">{product.retailer}</p>
                        <p className="text-xs text-neutral-500 leading-relaxed">{product.description}</p>
                      </div>
                      <span className="text-neutral-300 text-xs mt-0.5 shrink-0">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
