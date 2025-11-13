import React, { useEffect, useState } from 'react';
import { SearchIcon, SparklesIcon, HomeIcon, HeartIcon, FolderIcon, UserIcon, TrendingUpIcon, ImageIcon, UploadIcon, WandIcon, SunIcon, MoonIcon } from 'lucide-react';

type StyleRecommendation = {
  id: number;
  title: string;
  vibe: string;
  description: string;
  image: string;
  tags: string[];
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
export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRipple, setShowRipple] = useState(true);
  const [searchResults, setSearchResults] = useState<StyleRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => setShowRipple(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.dataset.theme = theme;
  }, [theme]);
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
    const results = styleRecommendations.filter(look => look.tags.some(tag => tag.includes(query)) || look.title.toLowerCase().includes(query) || look.vibe.toLowerCase().includes(query));
    setSearchResults(results);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery);
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGenerate = () => {
    if (!userPhoto || selectedOutfit === null) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedImage('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600');
      setIsGenerating(false);
    }, 2000);
  };
  const gradientBackground = isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100' : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-slate-900';
  const navBackground = isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200';
  const panelSurface = isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white/80 border border-slate-200 shadow-lg shadow-cyan-500/5';
  const cardSurface = isDark ? 'bg-slate-950/70 border border-slate-800' : 'bg-white border border-slate-200 shadow-lg shadow-slate-200/70';
  const softText = isDark ? 'text-slate-300' : 'text-slate-600';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBackground = isDark ? 'bg-slate-950/70 border border-slate-800 shadow-2xl shadow-cyan-500/10' : 'bg-white border border-slate-200 shadow-2xl shadow-slate-200/80';
  const chipSurface = isDark ? 'bg-slate-950/50 border border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-cyan-200' : 'bg-white border border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600';
  const inactiveTabClasses = isDark ? 'text-slate-400 border-transparent hover:border-slate-700 hover:bg-slate-900/60' : 'text-slate-500 border-transparent hover:border-slate-200 hover:bg-white/70';
  const activeTabClasses = isDark ? 'bg-cyan-500/10 text-cyan-200 border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'bg-cyan-500/15 text-cyan-700 border-cyan-500/40 shadow-lg shadow-cyan-500/20';
  const disabledGenerateClasses = isDark ? 'disabled:bg-slate-700 disabled:text-slate-400' : 'disabled:bg-slate-200 disabled:text-slate-500';

  return <div className={`relative w-full min-h-screen overflow-hidden ${gradientBackground}`}>
      {showRipple && <div className={`gradient-ripple absolute inset-0 ${isDark ? '' : 'opacity-70'}`} />}
      <div className="relative z-10">
        {/* Tab Bar */}
        <nav className={`backdrop-blur-lg border-b sticky top-0 z-10 ${navBackground}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-500" />
                <span className={`text-2xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Style<span className="font-semibold text-cyan-300">X</span>
                </span>
              </div>
              {/* Tabs */}
              <div className="flex items-center gap-1">
                {tabs.map(tab => {
                const Icon = tab.icon;
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${activeTab === tab.id ? activeTabClasses : inactiveTabClasses}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>;
              })}
              </div>
              <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`ml-4 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-900/70' : 'border-slate-200 text-slate-700 hover:bg-white/70'}`}>
                {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
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
                  <SparklesIcon className="w-10 h-10 text-cyan-500" />
                  <span className={`text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Style<span className="font-semibold text-cyan-300">X</span>
                  </span>
                </div>
                <p className={`text-lg font-light ${softText}`}>
                  AI-powered fashion curation, tailored to your style
                </p>
              </div>
              {/* Search Box */}
              <form onSubmit={handleSearch} className="relative">
                <div className={`relative rounded-2xl overflow-hidden transition-all hover:shadow-cyan-500/20 ${inputBackground}`}>
                  <div className="flex items-center px-6 py-5">
                    <SearchIcon className={`w-6 h-6 mr-4 flex-shrink-0 ${mutedText}`} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="coastal grandma aesthetic sweaters" className={`flex-1 text-lg bg-transparent border-none outline-none ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`} />
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40">
                  Discover Your Style
                </button>
              </form>
              {/* Suggestions */}
              <div className="mt-8 text-center">
                <p className={`text-sm mb-3 ${mutedText}`}>Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Minimalist basics', 'Vintage denim', 'Office casual', 'Boho chic'].map(tag => <button key={tag} onClick={() => {
                  setSearchQuery(tag);
                  runSearch(tag);
                }} className={`px-4 py-2 rounded-full text-sm transition-colors ${chipSurface}`}>
                      {tag}
                    </button>)}
                </div>
              </div>
              {hasSearched && <div className="mt-12 space-y-6">
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Curated looks for {searchQuery ? `"${searchQuery}"` : 'you'}
                    </h3>
                    <p className={mutedText}>
                      Generated from our AI trend index and your search mood.
                    </p>
                  </div>
                  {searchResults.length === 0 ? <div className={`${panelSurface} rounded-2xl p-8 text-center ${softText}`}>
                      <p className="font-medium text-lg">
                        We couldn’t find a perfect match.
                      </p>
                      <p className={`text-sm mt-2 ${mutedText}`}>
                        Try another prompt or pick one of the popular searches above.
                      </p>
                    </div> : <div className="grid gap-5 sm:grid-cols-2">
                      {searchResults.map(look => <div key={look.id} className={`${cardSurface} rounded-2xl overflow-hidden`}>
                          <img src={look.image} alt={look.title} className="w-full h-48 object-cover" />
                          <div className="p-5 space-y-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80 mb-1">
                                {look.vibe}
                              </p>
                              <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {look.title}
                              </h4>
                            </div>
                            <p className={`text-sm ${softText}`}>
                              {look.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {look.tags.map(tag => <span key={tag} className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-slate-900/80 border border-slate-800 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}>
                                  {tag}
                                </span>)}
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </div>}
            </div>
          </div>}
        {activeTab === 'try-on' && <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-light mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Virtual Try-On
                </h2>
                <p className={softText}>
                  Upload your photo and see how different outfits look on you
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Upload & Select */}
                <div className="space-y-6">
                  {/* Upload Photo */}
                  <div className={`${panelSurface} rounded-2xl p-6`}>
                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      1. Upload Your Photo
                    </h3>
                    {!userPhoto ? <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-cyan-400 bg-slate-900/40' : 'border-slate-300 hover:border-cyan-400 bg-slate-50'}`}>
                        <UploadIcon className={`w-12 h-12 mb-3 ${mutedText}`} />
                        <span className={`text-sm ${softText}`}>
                          Click to upload your photo
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label> : <div className="relative">
                        <img src={userPhoto} alt="Your photo" className="w-full h-64 object-cover rounded-xl" />
                        <button onClick={() => setUserPhoto(null)} className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-sm transition-colors ${isDark ? 'bg-slate-900/80 text-slate-200 hover:bg-slate-900' : 'bg-white/80 text-slate-700 hover:bg-white'}`}>
                          Change
                        </button>
                      </div>}
                  </div>
                  {/* Select Outfit */}
                  <div className={`${panelSurface} rounded-2xl p-6`}>
                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      2. Select an Outfit
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mockOutfits.map(outfit => <button key={outfit.id} onClick={() => setSelectedOutfit(outfit.id)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedOutfit === outfit.id ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' : isDark ? 'border-slate-800 hover:border-cyan-400/70' : 'border-slate-200 hover:border-cyan-400/70'}`}>
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
                  </div>
                  {/* Generate Button */}
                  <button onClick={handleGenerate} disabled={!userPhoto || selectedOutfit === null || isGenerating} className={`w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 ${disabledGenerateClasses} disabled:cursor-not-allowed text-slate-950 font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 flex items-center justify-center gap-2`}>
                    {isGenerating ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </> : <>
                        <WandIcon className="w-5 h-5" />
                        Generate Try-On
                      </>}
                  </button>
                </div>
                {/* Right Column - Result */}
                <div className={`${panelSurface} rounded-2xl p-6`}>
                  <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    3. Your Virtual Try-On
                  </h3>
                  {!generatedImage ? <div className={`flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-xl ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
                      <ImageIcon className={`w-16 h-16 mb-3 ${mutedText}`} />
                      <p className={`${mutedText} text-center px-6`}>
                        Your generated image will appear here
                      </p>
                    </div> : <div className="space-y-4">
                      <img src={generatedImage} alt="Generated try-on" className="w-full h-96 object-cover rounded-xl" />
                      <div className="flex gap-2">
                        <button className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors ${isDark ? 'bg-slate-900/70 hover:bg-slate-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                          Save
                        </button>
                        <button className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors ${isDark ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200' : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700'}`}>
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

