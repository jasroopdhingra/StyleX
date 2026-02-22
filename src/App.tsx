import React, { useState, useEffect } from 'react';
import { User, ShoppingBasket } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserProfile = {
  gender: string;
  age: string;
  aesthetic: string;
};

type Product = {
  title: string;
  retailer: string;
  url: string;
  description: string;
};

// ─── Onboarding data ─────────────────────────────────────────────────────────

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];
const AGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+', 'Prefer not to say'];
const AESTHETICS = [
  'Minimalist', 'Streetwear', 'Classic / Preppy', 'Bohemian',
  'Athleisure', 'Edgy / Dark', 'Romantic', 'Business Casual', 'Prefer not to say'
];

const SAMPLE_PROMPTS = [
  'Warm but professional',
  'Soft minimal weekend',
  'Sporty commute layers',
  'Night-out with metallics'
];

const PROFILE_KEY = 'lumi_profile';

// ─── Pill button ─────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-sm transition-all rounded-full border"
      style={{
        fontFamily: 'Syne, sans-serif',
        borderColor: selected ? 'var(--ink)' : 'var(--border)',
        background: selected ? 'var(--ink)' : 'transparent',
        color: selected ? 'var(--cream)' : 'var(--muted)',
      }}
    >
      {label}
    </button>
  );
}

// ─── Onboarding screen ───────────────────────────────────────────────────────

function Onboarding({ onComplete }: { onComplete: (p: UserProfile) => void }) {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [aesthetic, setAesthetic] = useState('');

  const canContinue = gender !== '' && age !== '' && aesthetic !== '';

  const handleContinue = () => {
    onComplete({ gender, age, aesthetic });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
      {/* Nav */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
            Lumi
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 flex flex-col gap-14">
        <div>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
            Before we start
          </p>
          <h1 className="text-4xl leading-tight" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            Tell us a little<br />about yourself.
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
            We use this to personalise your picks. Everything is optional.
          </p>
        </div>

        {/* Gender */}
        <div className="space-y-4">
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
            I shop for
          </p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(g => (
              <Pill key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="space-y-4">
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
            My age range
          </p>
          <div className="flex flex-wrap gap-2">
            {AGES.map(a => (
              <Pill key={a} label={a} selected={age === a} onClick={() => setAge(a)} />
            ))}
          </div>
        </div>

        {/* Aesthetic */}
        <div className="space-y-4">
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
            My aesthetic
          </p>
          <div className="flex flex-wrap gap-2">
            {AESTHETICS.map(a => (
              <Pill key={a} label={a} selected={aesthetic === a} onClick={() => setAesthetic(a)} />
            ))}
          </div>
        </div>

        {/* Continue */}
        <div>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="h-11 px-8 rounded-full text-sm font-medium transition-all disabled:opacity-30"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              background: canContinue ? 'var(--ink)' : 'transparent',
              color: canContinue ? 'var(--cream)' : 'var(--muted)',
              border: '1px solid var(--ink)',
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main app ────────────────────────────────────────────────────────────────

function MainApp({ profile, onResetProfile }: { profile: UserProfile; onResetProfile: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showcase, setShowcase] = useState<Product[]>([]);
  const [submittedVibe, setSubmittedVibe] = useState('');

  const profileSummary = [
    profile.gender !== 'Prefer not to say' ? profile.gender : null,
    profile.age !== 'Prefer not to say' ? profile.age : null,
    profile.aesthetic !== 'Prefer not to say' ? profile.aesthetic : null,
  ].filter(Boolean).join(' · ');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const vibe = prompt.trim();
    if (!vibe) {
      setError('Describe how you want to dress.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowcase([]);
    setSubmittedVibe(vibe);

    try {
      const response = await fetch('/api/match-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe, profile })
      });

      const data = await response.json();
      if (!response.ok || !Array.isArray(data?.products)) {
        throw new Error(data?.error || 'Unable to find products');
      }

      setShowcase(data.products);
    } catch (err) {
      console.error('Product search failed', err);
      setError(err instanceof Error ? err.message : 'Could not find products. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)', color: 'var(--ink)' }}>

      {/* Nav */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
            Lumi
          </span>
          <div className="flex items-center gap-4">
            {/* Person / Try-on */}
            <div className="relative group">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
                style={{ color: 'var(--muted)' }}
                onClick={onResetProfile}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="block text-[10px] tracking-widest uppercase whitespace-nowrap px-2 py-1 rounded" style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: 'Syne, sans-serif' }}>
                  Try-on
                </span>
              </div>
            </div>

            {/* Basket */}
            <div className="relative group">
              <button className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5" style={{ color: 'var(--muted)' }}>
                <ShoppingBasket className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="block text-[10px] tracking-widest uppercase whitespace-nowrap px-2 py-1 rounded" style={{ background: 'var(--ink)', color: 'var(--cream)', fontFamily: 'Syne, sans-serif' }}>
                  Basket
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-5xl md:text-7xl leading-none tracking-tight" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            Discover your<br />next outfit.
          </h1>
          {profileSummary && (
            <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
              {profileSummary}
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-0 border-b-2" style={{ borderColor: 'var(--ink)' }}>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your vibe..."
                className="flex-1 py-3 bg-transparent text-base focus:outline-none"
                style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--ink)' }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 pl-6 text-sm tracking-widest uppercase disabled:opacity-40 transition-opacity"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--ink)' }}
              >
                {isLoading ? 'Searching...' : 'Search →'}
              </button>
            </div>

            <div className="flex gap-6 mt-4 flex-wrap">
              {SAMPLE_PROMPTS.map(example => (
                <button
                  key={example}
                  type="button"
                  className="text-xs tracking-wider uppercase transition-colors"
                  style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </button>
              ))}
            </div>

            {error && <p className="mt-3 text-xs" style={{ color: '#b45309' }}>{error}</p>}
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6">
        {isLoading && (
          <>
            <div className="py-4 border-b text-xs tracking-widest uppercase" style={{ borderColor: 'var(--border)', color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
              Searching for &ldquo;{submittedVibe}&rdquo;
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="py-6 border-b animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-start gap-8">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 rounded" style={{ background: 'var(--border)', width: '55%' }} />
                    <div className="h-3 rounded" style={{ background: 'var(--border)', width: '20%' }} />
                    <div className="h-3 rounded mt-2" style={{ background: 'var(--border)', width: '80%' }} />
                  </div>
                  <div className="h-3 w-4 rounded" style={{ background: 'var(--border)' }} />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && showcase.length > 0 && (
          <>
            <div className="py-4 border-b text-xs tracking-widest uppercase" style={{ borderColor: 'var(--border)', color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
              {showcase.length} picks for &ldquo;{submittedVibe}&rdquo;
            </div>
            {showcase.map((product, i) => (
              <a
                key={i}
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-8 py-6 border-b group"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex gap-6 items-start flex-1 min-w-0">
                  <span className="text-xs pt-0.5 shrink-0 w-5" style={{ color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base leading-tight group-hover:underline underline-offset-2" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                      {product.title}
                    </p>
                    <p className="text-xs mt-1 tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
                      {product.retailer}
                    </p>
                    {product.description && (
                      <p className="text-sm mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                        {product.description.replace(/<[^>]+>/g, '')}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--muted)' }}>
                  ↗
                </span>
              </a>
            ))}
          </>
        )}
      </div>

    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const handleComplete = (p: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
  };

  const handleReset = () => {
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
  };

  if (loading) return null;
  if (!profile) return <Onboarding onComplete={handleComplete} />;
  return <MainApp profile={profile} onResetProfile={handleReset} />;
}
