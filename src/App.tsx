import React, { useState } from 'react';
import { SearchIcon, SparklesIcon, HomeIcon, HeartIcon, FolderIcon, UserIcon, TrendingUpIcon, ImageIcon, UploadIcon, WandIcon } from 'lucide-react';
export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
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
  return <div className="w-full min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50">
      {/* Tab Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-rose-600" />
              <span className="text-2xl font-light tracking-tight text-stone-800">
                Style<span className="font-semibold text-rose-600">X</span>
              </span>
            </div>
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {tabs.map(tab => {
              const Icon = tab.icon;
              return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-rose-100 text-rose-700' : 'text-stone-600 hover:bg-stone-100'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>;
            })}
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
                  <SparklesIcon className="w-10 h-10 text-rose-600" />
                  <span className="text-5xl font-light tracking-tight text-stone-800">
                    Style<span className="font-semibold text-rose-600">X</span>
                  </span>
                </div>
                <p className="text-lg text-stone-600 font-light">
                  AI-powered fashion curation, tailored to your style
                </p>
              </div>
              {/* Search Box */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transition-all hover:shadow-2xl">
                  <div className="flex items-center px-6 py-5">
                    <SearchIcon className="w-6 h-6 text-stone-400 mr-4 flex-shrink-0" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="coastal grandma aesthetic sweaters" className="flex-1 text-lg text-stone-800 placeholder-stone-400 bg-transparent border-none outline-none" />
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl">
                  Discover Your Style
                </button>
              </form>
              {/* Suggestions */}
              <div className="mt-8 text-center">
                <p className="text-sm text-stone-500 mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Minimalist basics', 'Vintage denim', 'Office casual', 'Boho chic'].map(tag => <button key={tag} onClick={() => setSearchQuery(tag)} className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-rose-300 hover:text-rose-600 transition-colors">
                      {tag}
                    </button>)}
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'try-on' && <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-stone-800 mb-2">
                  Virtual Try-On
                </h2>
                <p className="text-stone-600">
                  Upload your photo and see how different outfits look on you
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Upload & Select */}
                <div className="space-y-6">
                  {/* Upload Photo */}
                  <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">
                      1. Upload Your Photo
                    </h3>
                    {!userPhoto ? <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-rose-400 transition-colors bg-stone-50">
                        <UploadIcon className="w-12 h-12 text-stone-400 mb-3" />
                        <span className="text-sm text-stone-600">
                          Click to upload your photo
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label> : <div className="relative">
                        <img src={userPhoto} alt="Your photo" className="w-full h-64 object-cover rounded-xl" />
                        <button onClick={() => setUserPhoto(null)} className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm text-stone-600 hover:bg-stone-100">
                          Change
                        </button>
                      </div>}
                  </div>
                  {/* Select Outfit */}
                  <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">
                      2. Select an Outfit
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mockOutfits.map(outfit => <button key={outfit.id} onClick={() => setSelectedOutfit(outfit.id)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedOutfit === outfit.id ? 'border-rose-500 shadow-lg' : 'border-stone-200 hover:border-rose-300'}`}>
                          <img src={outfit.image} alt={outfit.name} className="w-full h-32 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs font-medium">
                              {outfit.name}
                            </p>
                          </div>
                          {selectedOutfit === outfit.id && <div className="absolute top-2 right-2 bg-rose-500 rounded-full p-1">
                              <SparklesIcon className="w-4 h-4 text-white" />
                            </div>}
                        </button>)}
                    </div>
                  </div>
                  {/* Generate Button */}
                  <button onClick={handleGenerate} disabled={!userPhoto || selectedOutfit === null || isGenerating} className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
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
                <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">
                    3. Your Virtual Try-On
                  </h3>
                  {!generatedImage ? <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50">
                      <ImageIcon className="w-16 h-16 text-stone-300 mb-3" />
                      <p className="text-stone-500 text-center px-6">
                        Your generated image will appear here
                      </p>
                    </div> : <div className="space-y-4">
                      <img src={generatedImage} alt="Generated try-on" className="w-full h-96 object-cover rounded-xl" />
                      <div className="flex gap-2">
                        <button className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 px-4 rounded-lg transition-colors">
                          Save
                        </button>
                        <button className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-3 px-4 rounded-lg transition-colors">
                          Share
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}