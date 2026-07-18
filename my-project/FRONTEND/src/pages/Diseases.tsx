import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Bot, Sprout } from 'lucide-react';
import { diseaseApi, Disease, DiseaseCategory } from '../services/diseaseApi';
import DiseaseCategoryCard from '../components/diseases/DiseaseCategoryCard';
import DiseaseSearch from '../components/diseases/DiseaseSearch';
import DiseaseFilter from '../components/diseases/DiseaseFilter';
import DiseaseGrid from '../components/diseases/DiseaseGrid';
import DiseaseDetail from '../components/diseases/DiseaseDetail';
import LoadingSkeleton from '../components/diseases/LoadingSkeleton';
import ErrorFallback from '../components/diseases/ErrorFallback';

const Diseases: React.FC = () => {
  // Data states
  const [categories, setCategories] = useState<DiseaseCategory[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [popularSlugs, setPopularSlugs] = useState<string[]>([]);
  
  // Loading & Diagnostics States
  const [loading, setLoading] = useState(true);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Syncing States
  const [syncing, setSyncing] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<Disease | null>(null);

  // Newsletter state
  const [emailValue, setEmailValue] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catsRes, dissRes, popRes] = await Promise.all([
          diseaseApi.getDiseaseCategories(),
          diseaseApi.getDiseases(),
          diseaseApi.getPopularDiseases()
        ]);

        setCategories(catsRes.data);
        setDiseases(dissRes.data);
        
        const slugs = popRes.data.map(d => d.slug);
        setPopularSlugs(slugs);

        if (catsRes.isFallback || dissRes.isFallback || popRes.isFallback) {
          setIsFallbackMode(true);
        }
      } catch (err) {
        setIsFallbackMode(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Compute filtered list
  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) => {
      const matchesSearch = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || d.category === selectedCategory;
      const matchesSeverity = !selectedSeverity || d.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [diseases, searchQuery, selectedCategory, selectedSeverity]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSeverity(null);
  };

  const handlePopularSelect = (slug: string) => {
    const found = diseases.find(d => d.slug === slug);
    if (found) {
      setActiveDetail(found);
    } else {
      setSearchQuery(slug);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setEmailSubscribed(true);
      setEmailValue('');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await diseaseApi.syncDiseases();
      if (res.data && !res.isFallback) {
        // Reload diseases list to fetch the newly synced MySQL data
        const dissRes = await diseaseApi.getDiseases();
        setDiseases(dissRes.data);
        alert("Real-time data successfully fetched from Wikipedia and openFDA, and stored in MySQL database!");
      } else {
        alert("Sync failed: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Sync failed: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* 0. Fallback Alert Banner */}
      {isFallbackMode && (
        <div className="pt-24 shrink-0">
          <ErrorFallback message="Using offline demo data" />
        </div>
      )}

      {/* 1. Hero Section */}
      <section className={`bg-gradient-to-br from-[#2E7D32]/10 via-[#F8FFF8] to-[#D4AF37]/5 px-6 md:px-12 text-center overflow-hidden ${isFallbackMode ? 'pt-6 pb-16' : 'pt-32 pb-20'}`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold text-primary animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Ayurvedic Diagnostics Library</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-primary">
            Disease Library
          </h1>
          <p className="text-xs md:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
            Explore Ayurvedic understanding, treatments, recovery timelines and wellness guidance. Learn how dosha corrections resolve systemic diseases.
          </p>

          {/* Search bar inside Hero */}
          <div className="flex justify-center pt-2">
            <DiseaseSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* 2. Interactive Disease Categories List */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-lg font-bold text-primary">Browse by Imbalance</h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[10px] font-bold uppercase text-accent hover:text-primary transition-colors"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white border border-gray-100 rounded-2xl h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <DiseaseCategoryCard
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Disease Grid & Filter Sidebar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filter Sidebar */}
          <div>
            <div className="sticky top-28 space-y-6">
              <DiseaseFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedSeverity={selectedSeverity}
                onSelectSeverity={setSelectedSeverity}
                popularDiseases={[
                  { name: 'Diabetes', slug: 'diabetes' },
                  { name: 'PCOS', slug: 'pcos' },
                  { name: 'Arthritis', slug: 'arthritis' },
                  { name: 'Migraine', slug: 'migraine' },
                  { name: 'Psoriasis', slug: 'psoriasis' },
                  { name: 'Gout', slug: 'gout' },
                  { name: 'Thyroid', slug: 'thyroid' },
                  { name: "Parkinson's", slug: 'parkinsons' },
                  { name: 'Depression', slug: 'depression' }
                ]}
                onSelectPopular={handlePopularSelect}
              />
            </div>
          </div>

          {/* Grid display */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h3 className="font-serif text-lg font-bold text-primary">Diagnostics Listing</h3>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1 ${
                    syncing
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary hover:border-primary/30'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Real-Time Data'}</span>
                </button>
              </div>
              <span className="text-xs font-semibold text-text-secondary">
                {loading ? 'Analyzing...' : `Showing ${filteredDiseases.length} Illnesses`}
              </span>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <DiseaseGrid
                diseases={filteredDiseases}
                onLearnMore={setActiveDetail}
                onReset={handleResetFilters}
              />
            )}
          </div>

        </div>
      </section>

      {/* 4. AI Guidance CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="bg-primary text-white p-8 md:p-12 rounded-3xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl -z-10 animate-float" />
          
          <div className="space-y-2.5">
            <h2 className="font-serif text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start">
              <MessageSquare className="w-6 h-6 text-accent mr-3 shrink-0" />
              <span>Need Personalized Guidance?</span>
            </h2>
            <p className="text-xs text-secondary max-w-md">
              Ask our Ayurvedic AI assistant for instant symptom assessments, customized diet advice, and direct Vaidya matching recommendations.
            </p>
          </div>

          <Link
            to="/"
            className="bg-white hover:bg-gray-50 text-primary font-bold text-xs px-8 py-3.5 rounded-full flex items-center space-x-2 shrink-0 shadow transition-colors"
          >
            <Bot className="w-4 h-4 text-accent" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </section>

      {/* 5. Weekly Remedies Newsletter */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto border border-primary/20">
          <Sprout className="w-6 h-6 text-accent" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-primary">Get Weekly Healing Insights</h2>
        <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
          Subscribe to our platform newsletter to receive customized recipes, dosha tips, and early booking notifications directly.
        </p>

        {emailSubscribed ? (
          <div className="p-4 bg-primary/15 border border-primary/30 rounded-2xl text-primary text-xs font-bold max-w-sm mx-auto animate-fade-in-up">
            🌿 Subscribed Successfully! Check your inbox for weekly herbal remedies.
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow bg-white border border-[#2E7D32]/15 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

      {/* 6. Detail Modal Overlay */}
      {activeDetail && (
        <DiseaseDetail
          disease={activeDetail}
          allDiseases={diseases}
          onClose={() => setActiveDetail(null)}
          onSelectDisease={setActiveDetail}
        />
      )}

    </div>
  );
};

export default Diseases;
