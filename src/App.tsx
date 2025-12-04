import React, { useEffect, useMemo, useState } from 'react';
import { SparklesIcon, ArrowRightIcon, Wand2Icon, Loader2Icon, Link2Icon, StarsIcon } from 'lucide-react';

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
    retailer: 'Arc’teryx',
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
  const [showcase, setShowcase] = useState<Product[]>([]);
  const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(null);

  const aiLines = useMemo(() => (aiCopy ? normalizeAiResponse(aiCopy) : []), [aiCopy]);

  useEffect(() => {
    const query = submittedPrompt?.trim() || '';
    if (!query) {
      setShowcase([]);
      return;
    }

    setShowcase(buildProductMatches(query));
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
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="aurora-bg" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-6 py-14 space-y-12">
        <header className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs uppercase tracking-[0.3em] text-slate-300">
            <StarsIcon className="h-4 w-4" />
            Lumi Style Studio
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">A calmer way to brief your next outfit</h1>
              <p className="text-slate-300 max-w-2xl text-lg">
                Type your vibe or occasion. Lumi drafts a mini styling direction and gives you shoppable picks with working links—no scrolling required.
              </p>
              <div className="flex gap-2 flex-wrap">
                {samplePrompts.map(example => (
                  <button
                    key={example}
                    className="px-3 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-56 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-sm text-slate-200 mb-2">Design language</p>
              <p className="text-lg font-medium">Soft gradients, glass panels, and motion cues keep things modern.</p>
            </div>
          </div>
        </header>

        <section className="glass-panel gradient-border rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(159,123,255,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.25),transparent_32%)]" aria-hidden />
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
                <Wand2Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Style prompt</p>
                <p className="text-lg text-slate-100">Tell Lumi how you want to feel</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Warm but professional with a hint of ease"
                  className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400/70 backdrop-blur placeholder:text-slate-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">Hit Enter ↵</span>
              </div>
              <button
                type="submit"
                className="h-14 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 text-slate-950 font-semibold flex items-center gap-2 shadow-[0_20px_60px_rgba(109,40,217,0.35)] hover:scale-[1.01] transition"
              >
                {isLoading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <SparklesIcon className="h-5 w-5" />}
                Draft my look
              </button>
            </div>
            {aiError && <p className="text-sm text-amber-200">{aiError}</p>}
          </form>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightIcon className="h-5 w-5 text-indigo-200" />
              <h2 className="text-xl font-semibold">Stylist brief</h2>
            </div>
            <div className="space-y-3 text-slate-200">
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Generating softer direction...
                </div>
              )}
              {!isLoading && aiLines.length === 0 && (
                <p className="text-slate-400">You will see Lumi’s tone-on-tone styling notes here after you submit a prompt.</p>
              )}
              {aiLines.map((line, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2Icon className="h-5 w-5 text-emerald-200" />
                <h2 className="text-xl font-semibold">Shop the signal</h2>
              </div>
              <span className="text-xs text-slate-400">Real, shoppable links</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {showcase.length === 0 && (
                <p className="text-slate-300 sm:col-span-2 text-sm">Type a prompt above to unlock shoppable picks tuned to your vibe.</p>
              )}
              {showcase.map(product => (
                <a
                  key={product.id}
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block p-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/30 transition group"
                >
                  <div className={`absolute inset-0 opacity-60 bg-gradient-to-br ${product.swatch}`} aria-hidden />
                  <div className="relative space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200 flex items-center gap-1">
                      <Link2Icon className="h-4 w-4" /> {product.retailer}
                    </p>
                    <p className="text-lg font-semibold text-white group-hover:translate-x-1 transition">{product.title}</p>
                    <p className="text-sm text-slate-900/70 bg-white/80 px-2 py-1 rounded-full inline-flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      Opens in new tab
                    </p>
                    <p className="text-sm text-slate-100/90">{product.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-fuchsia-200" />
            <h2 className="text-xl font-semibold">Micro-interactions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-slate-200">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-sm text-slate-300 mb-1">Animated gradients</p>
              <p>Background auroras drift subtly to keep the page feeling alive without distractions.</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-sm text-slate-300 mb-1">Glass panels</p>
              <p>Cards use softened borders, blur, and elevated shadows for a calm, modern surface.</p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-sm text-slate-300 mb-1">Link clarity</p>
              <p>Every recommendation opens to a real product page so you can shop immediately.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
