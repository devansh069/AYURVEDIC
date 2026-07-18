import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Heart, 
  Sprout, 
  Compass, 
  Clock, 
  Activity, 
  ChevronRight, 
  Info, 
  Calendar, 
  UserCheck, 
  Bot, 
  X, 
  CheckCircle2, 
  Brain,
  Mail,
  Send,
  Check
} from 'lucide-react';
import treatmentApi from '../services/treatmentApi';
import { Treatment, TreatmentCategory } from '../types';

// Components
import LoadingSkeleton from '../components/treatments/LoadingSkeleton';
import ErrorFallback from '../components/treatments/ErrorFallback';
import TreatmentSearch from '../components/treatments/TreatmentSearch';
import TreatmentFilter from '../components/treatments/TreatmentFilter';
import TreatmentGrid from '../components/treatments/TreatmentGrid';
import TreatmentCategoryCard from '../components/treatments/TreatmentCategoryCard';
import PanchakarmaSection from '../components/treatments/PanchakarmaSection';
import WellnessProgramCard from '../components/treatments/WellnessProgramCard';
import TreatmentComparison from '../components/treatments/TreatmentComparison';
import TreatmentTimeline from '../components/treatments/TreatmentTimeline';
import SuccessStoryCard from '../components/treatments/SuccessStoryCard';
import TreatmentFAQ from '../components/treatments/TreatmentFAQ';
import TreatmentDetail from '../components/treatments/TreatmentDetail';

export const Treatments: React.FC = () => {
  const navigate = useNavigate();

  // API States
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  // Syncing States
  const [syncing, setSyncing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedCost, setSelectedCost] = useState('');
  const [onlyPopular, setOnlyPopular] = useState(false);

  // Detail Modal States
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Interactive AI Assistant Quiz States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [aiRecommendation, setAiRecommendation] = useState<Treatment | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [treatmentsRes, categoriesRes] = await Promise.all([
          treatmentApi.getTreatments(),
          treatmentApi.getTreatmentCategories()
        ]);

        setTreatments(treatmentsRes.data);
        setCategories(categoriesRes.data);
        setIsFallback(treatmentsRes.isFallback || categoriesRes.isFallback);
      } catch (error) {
        console.error('Error fetching treatment data:', error);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Duration matcher helper
  const matchesDuration = (durationStr: string, range: string) => {
    if (!range) return true;
    const numbers = durationStr.match(/\d+/g)?.map(Number) || [];
    if (numbers.length === 0) {
      if (durationStr.toLowerCase().includes('day') && !durationStr.toLowerCase().includes('ongoing')) {
        return range === 'short';
      }
      return range === 'long';
    }
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    if (range === 'short') return min <= 5;
    if (range === 'medium') return (min >= 6 && min <= 14) || (max >= 6 && max <= 14) || (min <= 6 && max >= 14);
    if (range === 'long') return max >= 15;
    return true;
  };

  // Cost matcher helper
  const matchesCost = (cost: number, range: string) => {
    if (!range) return true;
    if (range === 'low') return cost < 3000;
    if (range === 'mid') return cost >= 3000 && cost <= 8000;
    if (range === 'high') return cost > 8000;
    return true;
  };

  // Filter and Search Logic
  const filteredTreatments = useMemo(() => {
    return treatments.filter((trt) => {
      // Search text query
      const matchesSearch = 
        trt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trt.suitableFor.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCat = !selectedCategory || trt.category.toLowerCase() === selectedCategory.toLowerCase();

      // Duration filter
      const matchesDur = matchesDuration(trt.duration, selectedDuration);

      // Cost filter
      const matchesPrice = matchesCost(trt.costEstimate, selectedCost);

      // Popular filter (Rating >= 4.9)
      const matchesPop = !onlyPopular || trt.rating >= 4.9;

      return matchesSearch && matchesCat && matchesDur && matchesPrice && matchesPop;
    });
  }, [treatments, searchQuery, selectedCategory, selectedDuration, selectedCost, onlyPopular]);

  // Extract unique category names from treatments
  const categoryNames = useMemo(() => {
    return Array.from(new Set(treatments.map((t) => t.category)));
  }, [treatments]);

  // Popular Treatments list (top 3)
  const popularTreatments = useMemo(() => {
    return treatments.filter(t => t.rating >= 4.9).slice(0, 3);
  }, [treatments]);

  // Wellness Programs list
  const wellnessPrograms = useMemo(() => {
    return treatments.filter(t => t.category.toLowerCase() === 'wellness programs');
  }, [treatments]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDuration('');
    setSelectedCost('');
    setOnlyPopular(false);
  };

  // Open treatment details
  const handleLearnMore = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsDetailOpen(true);
  };

  // Close details modal
  const handleCloseDetail = () => {
    setSelectedTreatment(null);
    setIsDetailOpen(false);
  };

  // AI Quiz Logic
  const handleQuizAnswer = (step: number, optionValue: string) => {
    const newAnswers = { ...answers, [step]: optionValue };
    setAnswers(newAnswers);

    if (step < 3) {
      setQuizStep(step + 1);
    } else {
      // Calculate dominant dosha
      const counts = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(newAnswers).forEach((val) => {
        if (val === 'vata') counts.vata += 1;
        if (val === 'pitta') counts.pitta += 1;
        if (val === 'kapha') counts.kapha += 1;
      });

      let dominant: 'vata' | 'pitta' | 'kapha' = 'vata';
      if (counts.pitta >= counts.vata && counts.pitta >= counts.kapha) dominant = 'pitta';
      if (counts.kapha >= counts.vata && counts.kapha >= counts.pitta) dominant = 'kapha';

      // Pick recommendation based on dominant dosha
      let recommendedSlug = 'panchakarma';
      if (dominant === 'vata') recommendedSlug = 'shirodhara'; // calming Shirodhara
      if (dominant === 'pitta') recommendedSlug = 'virechana'; // cooling Virechana
      if (dominant === 'kapha') recommendedSlug = 'udvartana'; // stimulating Udvartana

      const trtRec = treatments.find(t => t.slug === recommendedSlug) || treatments[0];
      setAiRecommendation(trtRec);
      setQuizStep(4);
    }
  };

  const resetQuiz = () => {
    setQuizStep(1);
    setAnswers({});
    setAiRecommendation(null);
  };

  // Newsletter subscribe handler
  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await treatmentApi.syncTreatments();
      if (res.data && !res.isFallback) {
        // Re-load treatments from MySQL to update client state
        const trtRes = await treatmentApi.getTreatments();
        setTreatments(trtRes.data);
        alert("Real-time treatment data successfully fetched from Wikipedia and stored in MySQL!");
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
    <div className="bg-background min-h-screen text-text-primary">
      {/* SECURE FALLBACK WARNING BANNER */}
      {isFallback && (
        <div className="sticky top-[72px] z-40 w-full px-4 pt-2">
          <ErrorFallback message="Using Demo Data" />
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Background decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Ayurvedic Healing Arts</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-primary leading-tight">
            Explore Ayurvedic <span className="text-gradient">Treatments</span>
          </h1>

          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-semibold max-w-2xl mx-auto">
            Discover traditional therapies, classical Panchakarma procedures, and customized wellness programs. Filter by duration, cost, or target dosha to find your path to healing.
          </p>

          {/* Search bar & filter trigger container */}
          <div className="space-y-4 pt-4">
            <TreatmentSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <TreatmentFilter 
              categories={categoryNames}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              selectedCost={selectedCost}
              onCostChange={setSelectedCost}
              onlyPopular={onlyPopular}
              onPopularChange={setOnlyPopular}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-20">

        {/* 3. TREATMENT CATEGORIES SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block">Classifications</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Treatment Categories</h2>
            </div>
            <p className="text-xs text-text-secondary max-w-md">
              Select a category block below to filter therapies in the library grid instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <TreatmentCategoryCard
                  key={cat.id}
                  category={cat}
                  isSelected={isSelected}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                />
              );
            })}
          </div>
        </section>

        {/* 4. POPULAR TREATMENTS SECTION */}
        {popularTreatments.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block font-sans">highly requested</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Popular Treatments</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularTreatments.map((trt) => (
                <div key={trt.id} className="relative group">
                  {/* Luxury glow effect behind popular cards */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  
                  <div className="bg-white border border-[#2E7D32]/5 hover:border-primary/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[450px]">
                    <div className="space-y-4">
                      {/* Image header */}
                      <div className="h-44 relative overflow-hidden bg-gray-50">
                        <img
                          src={trt.image}
                          alt={trt.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/95 backdrop-blur-md border border-primary/5 py-1 px-3 rounded-full shadow-sm">
                          <span className="text-primary text-[8px] font-bold uppercase tracking-wider">{trt.category}</span>
                          <span className="text-accent text-[10px] font-bold">★</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-5 space-y-2">
                        <h3 className="font-serif text-base font-bold text-primary">{trt.name}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 font-medium">
                          {trt.description}
                        </p>
                        
                        {/* Highlights list */}
                        <ul className="text-[10px] font-bold text-text-secondary space-y-1 pt-1.5">
                          {trt.benefits.slice(0, 2).map((b, idx) => (
                            <li key={idx} className="flex items-center space-x-1 text-primary">
                              <span className="text-accent text-xs">✔</span>
                              <span className="truncate">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-50 flex justify-between items-center bg-[#F8FFF8]/25">
                      <div>
                        <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">Est. Cost</span>
                        <span className="text-sm font-black text-primary">₹{trt.costEstimate.toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        onClick={() => handleLearnMore(trt)}
                        className="bg-primary hover:bg-primary-light text-white font-bold text-[10px] py-2.5 px-4 rounded-xl shadow-md transition-all uppercase tracking-wider"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. PANCHAKARMA SPECIAL SECTION */}
        <PanchakarmaSection treatments={treatments} onLearnMore={handleLearnMore} />

        {/* 5. TREATMENT LIBRARY GRID */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-primary/10 pb-4 gap-4">
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block">Complete Registry</span>
              <div className="flex items-center space-x-3">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Treatment Library Grid</h2>
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
            </div>
            <div className="text-xs font-semibold text-text-secondary bg-primary/5 py-1.5 px-4 rounded-full border border-primary/5">
              Showing <span className="text-primary font-black">{filteredTreatments.length}</span> of {treatments.length} matching treatments
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <TreatmentGrid 
              treatments={filteredTreatments} 
              onLearnMore={handleLearnMore} 
              onResetFilters={handleResetFilters}
            />
          )}
        </section>

        {/* 8. WELLNESS PROGRAMS SECTION */}
        {wellnessPrograms.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="text-accent text-[9px] font-bold uppercase tracking-widest block">Chronic Support</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary">Wellness Programs</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {wellnessPrograms.map((prog) => (
                <WellnessProgramCard 
                  key={prog.id}
                  program={prog}
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </section>
        )}

        {/* 9. TREATMENT COMPARISON SECTION */}
        <TreatmentComparison treatments={treatments} />

        {/* 10. RECOVERY TIMELINE SECTION */}
        <TreatmentTimeline />

        {/* 11. SUCCESS STORIES SECTION */}
        <SuccessStoryCard />

        {/* 12. AI GUIDANCE BANNER */}
        <section className="bg-gradient-to-r from-primary via-primary-light to-[#1B5E20] text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-20 -translate-y-20 blur-2xl" />

          <div className="space-y-3.5 max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/10">
              <Bot className="w-4.5 h-4.5 text-accent shrink-0 animate-bounce" />
              <span>Ayurvedic Advisor AI</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-black">
              Not Sure Which Treatment Is Right For You?
            </h2>
            <p className="text-xs text-white/90 leading-relaxed font-semibold">
              Answer 3 simple questions about your bodily frame and skin type to determine your dominant Dosha (constitution) and instantly find matched Ayurvedic treatments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 relative z-10">
            <button
              onClick={() => {
                resetQuiz();
                setIsAiModalOpen(true);
              }}
              className="bg-accent hover:bg-accent-light text-primary font-bold text-xs py-4 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <span>Ask AI Assistant</span>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
            </button>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-4 px-6 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Find Doctor</span>
            </button>
          </div>
        </section>

        {/* 13. FAQ SECTION */}
        <TreatmentFAQ />

        {/* 14. NEWSLETTER SECTION */}
        <section className="bg-white border border-[#2E7D32]/10 p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-3xl mx-auto space-y-6 relative">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto">
            <Mail className="w-6 h-6 text-accent" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-primary">Embark on Your Wellness Journey</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium max-w-md mx-auto">
              Subscribe to the AyurVeda Insights newsletter to receive seasonal recipes, health tips, and direct therapy guides directly in your inbox.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="bg-[#F8FFF8] border border-primary/20 text-primary py-3.5 px-6 rounded-2xl inline-flex items-center space-x-2.5 text-xs font-bold animate-fade-in-up">
              <Check className="w-4.5 h-4.5 text-accent shrink-0" />
              <span>Thank you! Your secure subscription is now active.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-[#FAF9F6] border border-[#2E7D32]/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary font-semibold text-text-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-colors shrink-0 uppercase tracking-widest flex items-center justify-center space-x-1.5"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5 text-accent" />
              </button>
            </form>
          )}
        </section>

      </div>

      {/* 6. TREATMENT DETAIL MODAL */}
      <TreatmentDetail 
        treatment={selectedTreatment}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* INTERACTIVE DOSHA advisor MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8FFF8] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col animate-fade-in-up">
            
            {/* Modal header */}
            <div className="bg-primary text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-serif text-sm font-bold">Prakriti & Therapy Advisor AI</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {quizStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase">
                    <span>Physical Frame Quiz</span>
                    <span>Question 1 of 3</span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold font-serif text-primary">
                    Which best describes your physical frame and natural body activity?
                  </h4>
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => handleQuizAnswer(1, 'vata')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🚶 Light, thin build; active and always on the move; prone to cold feet/hands.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(1, 'pitta')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🏃 Medium build; determined, focused and intense; feels warm easily.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(1, 'kapha')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🧘 Broad, strong build; calm, relaxed, steady; gains weight relatively easily.
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase">
                    <span>Skin Profile Quiz</span>
                    <span>Question 2 of 3</span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold font-serif text-primary">
                    How does your skin typically behave or feel?
                  </h4>
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => handleQuizAnswer(2, 'vata')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🍂 Dry, rough, cold, or cracking, especially during changes in season.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(2, 'pitta')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🔥 Sensitive, warm, prone to redness, hives, or oily in the T-zone.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(2, 'kapha')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🌊 Soft, moist, smooth, thick, and oily; rarely gets dry or irritated.
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase">
                    <span>Wellness Goal Quiz</span>
                    <span>Question 3 of 3</span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold font-serif text-primary">
                    What is your primary wellness goal right now?
                  </h4>
                  <div className="flex flex-col space-y-2.5">
                    <button
                      onClick={() => handleQuizAnswer(3, 'vata')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      💨 Relieve mental anxiety, insomnia, or physical joint stiffness.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(3, 'pitta')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🔥 Clear skin breakouts, digest acid reflux, or purify blood and liver.
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(3, 'kapha')}
                      className="p-3.5 rounded-xl border border-gray-150/70 text-left text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all text-text-primary"
                    >
                      🌱 Manage body weight, clear nasal congestion, or boost slow metabolism.
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 4 && aiRecommendation && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary mx-auto animate-bounce">
                    <CheckCircle2 className="w-9 h-9 text-accent shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-accent uppercase tracking-wider block">AI Evaluation Complete</span>
                    <h4 className="text-base font-bold font-serif text-primary">
                      We suggest: {aiRecommendation.name}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto font-medium">
                      Based on your quiz profile, your dominant constitution is responding well to {aiRecommendation.category} therapies. This treatment will help restore dosha alignment and clear blocks.
                    </p>
                  </div>

                  {/* Micro recommendation card */}
                  <div className="bg-white border border-[#2E7D32]/10 p-4 rounded-2xl flex items-center space-x-4 text-left shadow-sm">
                    <img 
                      src={aiRecommendation.image} 
                      alt={aiRecommendation.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0" 
                    />
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-primary font-serif">{aiRecommendation.name}</h5>
                      <p className="text-[10px] text-text-secondary leading-snug line-clamp-2">{aiRecommendation.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsAiModalOpen(false);
                        handleLearnMore(aiRecommendation);
                      }}
                      className="flex-grow bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 rounded-xl shadow-md uppercase tracking-wider"
                    >
                      Read Detailed Steps
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="border border-[#2E7D32]/25 hover:bg-primary/5 text-primary font-bold text-xs py-3 px-4 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Treatments;
