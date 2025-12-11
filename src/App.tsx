import React, { useMemo, useState } from 'react';
import { Loader2Icon, SparklesIcon } from 'lucide-react';

type DraftLookResponse = {
  advice: string;
  links: string[];
};

const fallbackLinks = [
  'https://www.arcteryx.com/us/en/shop/womens/beta-jacket',
  'https://www.everlane.com/products/womens-rib-knit-mockneck-sweater-heathered-sand',
  'https://www.aritzia.com/us/en/product/the-effortless-pant/98721.html'
];

const quickIdeas = [
  'Clean girl aesthetic for brunch',
  'Coastal grandma vibes',
  'Dark academia for fall'
];

const normalizeAiResponse = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

export function App() {
  const [prompt, setPrompt] = useState('');
  const [aiCopy, setAiCopy] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowcaseLoading, setIsShowcaseLoading] = useState(false);
  const [showcase, setShowcase] = useState<string[]>([]);
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
      const response = await fetch('/api/draft-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data: Partial<DraftLookResponse> & { error?: string } = await response.json();

      if (!response.ok || typeof data?.advice !== 'string' || !Array.isArray(data?.links)) {
        throw new Error(data?.error || 'Unable to draft this look right now.');
      }

      setAiCopy(data.advice);
      setShowcase(data.links);
    } catch (error) {
      console.error('Failed to fetch AI recommendation', error);
      setAiError('Could not reach the stylist right now. Try again in a few seconds.');
      setShowcase(fallbackLinks);
      setProductError('Could not fetch product links. Showing backup picks.');
    } finally {
      setIsLoading(false);
      setIsShowcaseLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6efe7] text-[#2c221b] flex flex-col items-center px-4 py-12">
      <header className="flex flex-col items-center text-center gap-3 mb-10">
        <div className="flex items-center gap-2 text-[#4fbda5]">
          <SparklesIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Glow by Lumi</span>
        </div>
        <div className="text-5xl md:text-6xl font-serif tracking-tight text-[#2a2018]">Lumi</div>
        <p className="max-w-3xl text-lg leading-relaxed text-[#4d4036]">
          Your AI-powered personal fashion curator. Describe your style in natural language and discover perfectly curated outfits
          that match your aesthetic.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <section className="bg-white rounded-2xl shadow-lg border border-[#e5dacf] p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7c6c5e]">Describe your desired style</p>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g., 'clean girl aesthetic' or 'coastal grandma vibes'"
                  className="w-full h-40 rounded-xl border border-[#d9cfc3] bg-white px-4 py-3 text-lg text-[#2c221b] placeholder:text-[#9b8c7f] focus:outline-none focus:ring-2 focus:ring-[#c8b8a6] resize-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[#c4b5a6]">
                  <span className="h-8 w-8 rounded-full border border-[#d9cfc3] bg-[#f4ece3]" aria-hidden />
                  <span className="h-8 w-8 rounded-full border border-[#d9cfc3] bg-[#f4ece3]" aria-hidden />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[#5f5246]">Quick ideas:</span>
              {quickIdeas.map(idea => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="px-4 py-2 rounded-full bg-[#f1e7dc] text-[#3e3127] text-sm font-medium border border-[#e0d2c3] hover:bg-[#e9dece] transition"
                >
                  {idea}
                </button>
              ))}
            </div>

            {aiError && <p className="text-sm text-[#9b4c2c]">{aiError}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#8a7f73] text-white text-lg font-semibold shadow-md hover:bg-[#7b6f63] disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Curating…' : '✨ Curate My Outfit'}
            </button>
          </form>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#3a2f25]">Stylist brief</h2>
              <div className="space-y-3 text-[#4f4338]">
                {isLoading && (
                  <div className="text-sm text-[#7c6c5e] flex items-center gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Generating softer direction...
                  </div>
                )}
                {!isLoading && aiLines.length === 0 && (
                  <p className="text-sm text-[#8b7b6c]">You will see Lumi’s styling notes here after you submit a prompt.</p>
                )}
                {aiLines.map((line, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-[#e5dacf] bg-[#f9f4ee] text-sm">
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[#3a2f25]">
                <h2 className="text-lg font-semibold">Shop the signal</h2>
                <span className="text-xs text-[#7c6c5e]">Real, shoppable links</span>
              </div>
              {productError && !isShowcaseLoading && (
                <p className="text-sm text-[#9b4c2c]">{productError}</p>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {isShowcaseLoading && (
                  <div className="sm:col-span-2 flex items-center gap-2 text-sm text-[#7c6c5e]">
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Curating product links—check back in a few seconds.
                  </div>
                )}
                {!isShowcaseLoading && showcase.length === 0 && (
                  <p className="text-sm text-[#8b7b6c] sm:col-span-2">Type a prompt above to unlock shoppable picks tuned to your vibe.</p>
                )}
                {showcase.map(link => {
                  let domain = 'source';
                  try {
                    domain = new URL(link).hostname.replace(/^www\./, '');
                  } catch (error) {
                    console.error('Invalid link from showcase', link, error);
                  }

                  return (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block p-4 rounded-xl border border-[#e5dacf] bg-[#f9f4ee] hover:border-[#d2c4b5] transition"
                    >
                      <p className="text-xs uppercase tracking-[0.15em] text-[#7c6c5e] mb-1">{domain}</p>
                      <p className="text-base font-semibold text-[#32281f]">Shop this piece</p>
                      <p className="text-sm text-[#5f5246] break-words">{link}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
