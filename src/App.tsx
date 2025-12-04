import React, { useMemo, useState } from 'react';
import { SparklesIcon, ArrowRightIcon, Wand2Icon, Loader2Icon, Link2Icon, StarsIcon } from 'lucide-react';

type ProductLink = {
  url: string;
  title: string;
  source: string;
};

const fallbackProducts: ProductLink[] = [
  {
    title: 'Waterproof shell jacket',
    url: 'https://www.arcteryx.com/us/en/shop/womens/beta-jacket',
    source: 'arcteryx.com'
  },
  {
    title: 'Ribbed mock-neck sweater',
    url: 'https://www.everlane.com/products/womens-rib-knit-mockneck-sweater-heathered-sand',
    source: 'everlane.com'
  },
  {
    title: 'Pleated trouser in cool brown',
    url: 'https://www.aritzia.com/us/en/product/the-effortless-pant/98721.html',
    source: 'aritzia.com'
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

export function App() {
  const [prompt, setPrompt] = useState('');
  const [aiCopy, setAiCopy] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowcaseLoading, setIsShowcaseLoading] = useState(false);
  const [showcase, setShowcase] = useState<ProductLink[]>([]);
  const [productError, setProductError] = useState<string | null>(null);

  const aiLines = useMemo(() => (aiCopy ? normalizeAiResponse(aiCopy) : []), [aiCopy]);

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
    setIsShowcaseLoading(true);
    setShowcase([]);
    setProductError(null);

    try {
      const stylePromise = fetch('/api/generate-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      })
        .then(async response => {
          const data = await response.json();
          if (!response.ok || typeof data?.response !== 'string') {
            throw new Error(data?.error || 'Unable to generate response');
          }
          return data.response as string;
        });

      const productPromise = fetch('/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      })
        .then(async response => {
          const data = await response.json();
          if (!response.ok || !Array.isArray(data?.results)) {
            throw new Error(data?.error || 'Unable to fetch products');
          }
          return data.results as ProductLink[];
        });

      const [styleResult, productResult] = await Promise.allSettled([stylePromise, productPromise]);

      if (styleResult.status === 'fulfilled') {
        setAiCopy(styleResult.value);
      } else {
        setAiCopy(null);
        setAiError('Could not reach the stylist right now. Try again in a few seconds.');
      }

      if (productResult.status === 'fulfilled') {
        const items = productResult.value;
        if (items.length === 0) {
          setShowcase(fallbackProducts);
          setProductError('No live product links yet. Showing staples while we search.');
        } else {
          setShowcase(items);
        }
      } else {
        setShowcase(fallbackProducts);
        setProductError('Could not fetch product links. Showing backup picks.');
      }
    } catch (error) {
      console.error('Failed to fetch AI recommendation', error);
      setAiError('Could not reach the stylist right now. Try again in a few seconds.');
      setShowcase(fallbackProducts);
      setProductError('Could not fetch product links. Showing backup picks.');
    } finally {
      setIsLoading(false);
      setIsShowcaseLoading(false);
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
            {productError && !isShowcaseLoading && (
              <p className="text-sm text-amber-200">{productError}</p>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {isShowcaseLoading && (
                <div className="sm:col-span-2 flex items-center gap-2 text-slate-300 text-sm">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Curating product links—check back in a few seconds.
                </div>
              )}
              {!isShowcaseLoading && showcase.length === 0 && (
                <p className="text-slate-300 sm:col-span-2 text-sm">Type a prompt above to unlock shoppable picks tuned to your vibe.</p>
              )}
              {showcase.map(product => (
                <a
                  key={product.url}
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block p-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/30 transition group"
                >
                  <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-indigo-200/70 via-fuchsia-200/70 to-amber-200/70" aria-hidden />
                  <div className="relative space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200 flex items-center gap-1">
                      <Link2Icon className="h-4 w-4" /> {product.source}
                    </p>
                    <p className="text-lg font-semibold text-white group-hover:translate-x-1 transition">{product.title}</p>
                    <p className="text-sm text-slate-900/70 bg-white/80 px-2 py-1 rounded-full inline-flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      Opens in new tab
                    </p>
                    <p className="text-sm text-slate-100/90 break-words">{product.url}</p>
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
